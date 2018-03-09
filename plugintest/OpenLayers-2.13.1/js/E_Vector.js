/**
 * @requires OpenLayers/Layer.Vector.js
 */

/**
 * 图层支持文字标注
 * @author lz
 */

/**

 example:

 var e_vectorLayer = new OpenLayers.Layer.E_Vector("Simple Geometry", {
        style: layer_style,
        renderers: renderer
    });

 var point = new OpenLayers.Geometry.Point(-111.04, 45.68);
 var pointFeature = new OpenLayers.Feature.Vector(point,{name:"point"});
 e_vectorLayer.addFeature(pointFeature);

 map.addLayer(e_vectorLayer);

 e_vectorLayer.initAnnotations();
 e_vectorLayer.setAnnotationStyle(0,0,"name");
 e_vectorLayer.showAnnotations();

 */

OpenLayers.Layer.E_Vector = OpenLayers.Class(OpenLayers.Layer.Vector, {
	/**
	 * Property: annotations
	 * {Array{object}}  图层标注
	 */
	annotations : null,
	/**
	 * Property: annotationsVisible
	 * {boolean}  图层标注是否展示
	 */
	annotationsVisible : false,
	/**
	 * Property: annotationOffset
	 * {Object} 图层标注偏移量
	 */
	annotationOffset : {x:0,y:0},
	/**
	 * Property bindFiled
	 * {Object} 图层标注绑定feature attribute要素字段
	 */
	bindFiled : null,
	
	/**
	 * Constructor: OpenLayers.Layer.E_Vector
	 */
	initialize : function(layerName,options) {
		OpenLayers.Layer.Vector.prototype.initialize.apply(this,arguments);
		this.annotations = [];	
				
    },
	/**
	 * 设置标注的便宜量及绑定的字段
	 * @param offsetx
	 * @param offsety
	 * @param filed
	 */
    setAnnotationStyle : function(offsetx,offsety,filed){
    	this.annotationOffset.x = offsetx;
    	this.annotationOffset.y = offsety;
    	this.bindFiled = filed;
    },
	/**
	 * 创建标注
	 * @param data
	 */
    createAnnotation :function(data){
    	if(!this.annotationsVisible && data.feature.layer != this)return;
    	if(data.feature.attributes != null
			&& data.feature.attributes.annotationDisplay != null
			&& data.feature.attributes.annotationDisplay==false)
			return;
		if(data.feature.attributes.hasOwnProperty(this.bindFiled)==false)return;
    	for (var i = 0, len = this.annotations.length; i < len; i++) {
    		if (this.annotations[i].feature == data.feature) {
            	return;
        	}
        }
    	var lglt = null;
    	if (data.feature.geometry instanceof OpenLayers.Geometry.Point) {
    		lglt = data.feature.geometry.getBounds().getCenterLonLat();
		} else if (data.feature.geometry instanceof OpenLayers.Geometry.LineString) {  //取线图形的中部作为展示标注的位置
			var lineGeos = data.feature.geometry.getVertices();
			lglt = lineGeos[parseInt(lineGeos.length / 2)].getBounds().getCenterLonLat();
		} else if (data.feature.geometry instanceof OpenLayers.Geometry.Polygon) {    //取面图形的中心作为展示标注的位置
			var point = data.feature.geometry.getCentroid();
			lglt = point.getBounds().getCenterLonLat();
		}
    	var px = this.map.getLayerPxFromLonLat(lglt).add(this.annotationOffset.x,this.annotationOffset.y);
    	//size 可以根据自己需要写到外部
		var size = new OpenLayers.Size(120,30);
    	var divId = OpenLayers.Util.createUniqueID("E_Annotation"+"_");
    	var anDiv = OpenLayers.Util.createDiv(divId, px, size,null, null, null, "hidden");
    	this.map.layerContainerDiv.appendChild(anDiv);
    	anDiv.innerHTML = data.feature.attributes[this.bindFiled];
    	anDiv.style.zIndex = 250;
    	this.annotations.push({feature:data.feature,div:anDiv});
    },
	/**
	 * 重新绘制标注
	 */
    redrawAnnotations : function(){
    	for(var i=0;i<this.annotations.length;i++){
    		var lglt = null;
        	if (this.annotations[i].feature.geometry instanceof OpenLayers.Geometry.Point) {
        		lglt = this.annotations[i].feature.geometry.getBounds().getCenterLonLat();
    		} else if (this.annotations[i].feature.geometry instanceof OpenLayers.Geometry.LineString) {
    			var lineGeos = this.annotations[i].feature.geometry.getVertices();
    			lglt = lineGeos[parseInt(lineGeos.length / 2)].getBounds().getCenterLonLat();
    		} else if (this.annotations[i].feature.geometry instanceof OpenLayers.Geometry.Polygon) {
    			var point = this.annotations[i].feature.geometry.getCentroid();
    			lglt = point.getBounds().getCenterLonLat();
    		}
    		var newPx = this.getLayerPxFromLonLat(lglt).add(this.annotationOffset.x,this.annotationOffset.y);
    		this.annotations[i].div.style.left = newPx.x + "px";
    		this.annotations[i].div.style.top = newPx.y + "px";
    	}
    },
	deleteAnnotation: function(data) {
		for(var i in this.annotations){
			if(this.annotations[i] == data.feature){
				this.removeAnnotation(this.annotations[i]);
				break;
			}
		}
	},
    removeAnnotation: function(annotation) {
        OpenLayers.Util.removeItem(this.annotations, annotation);
        if (annotation.div) {
            try { this.map.layerContainerDiv.removeChild(annotation.div); }
            catch (e) { }
        }
    },
	/**
	 * 移除所有标注
	 */
    removeAllAnnotations : function (){
    	if(this.annotations == null)return;
    	while(this.annotations.length>0)
    		this.removeAnnotation(this.annotations[0]);
    },
    /**
     * 重写父类方法，注记的显示或隐藏，与图层同步
     */
    display: function(display) {
        OpenLayers.Layer.Vector.prototype.display.apply(this, arguments);
    	for(var i=0;i<this.annotations.length;i++){
    		this.annotations[i].div.style.display = display ? "block" : "none";
        }
    },
    /**
     * 重写父类方法，释放注记对象
     */
    removeMap: function(map) {
    	OpenLayers.Layer.Vector.prototype.removeMap.apply(this, arguments);
    	this.removeAllAnnotations();
    	this.annotations = null;
    },
    /**
     * 初始化标注
     */
    initAnnotations: function(){
    	//this.annotationsVisible = true;
    	var self = this;
    	//重新绘制，warn：不得重新写方法，必须写成内部
    	this.map.events.on({"zoomend":
    		function(){
    		if(self.annotations==null)return;
    		for(var i=0;i<self.annotations.length;i++){
    			var lglt = null;
            	if (self.annotations[i].feature.geometry instanceof OpenLayers.Geometry.Point) {
            		lglt = self.annotations[i].feature.geometry.getBounds().getCenterLonLat();
        		} else if (self.annotations[i].feature.geometry instanceof OpenLayers.Geometry.LineString) {
        			var lineGeos = self.annotations[i].feature.geometry.getVertices();
        			lglt = lineGeos[parseInt(lineGeos.length / 2)].getBounds().getCenterLonLat();
        		} else if (self.annotations[i].feature.geometry instanceof OpenLayers.Geometry.Polygon) {
        			var point = self.annotations[i].feature.geometry.getCentroid();
        			lglt = point.getBounds().getCenterLonLat();
        		}
    			var newPx = this.getLayerPxFromLonLat(lglt).add(self.annotationOffset.x,self.annotationOffset.y);
    			self.annotations[i].div.style.left = newPx.x + "px";
    			self.annotations[i].div.style.top = newPx.y + "px";
    		}
    	}});
    	this.events.on({"featureadded": this.createAnnotation});//监听featureadded事件
		this.events.on({"featureremoved": this.deleteAnnotation});//监听featureremoved事件
    },
    /**
     * 展示所有标注（采用直接create方法,暂时忽略大数据量,数据量过大可选择性标注）
     */
    showAnnotations:function(){
    	this.annotationsVisible = true;
    	for(var i=0;i<this.features.length;i++){
    		this.createAnnotation({feature:this.features[i]});
    	}
    },
    /**
     * 隐藏所有标注（为减少页面DOM对象，采用直接remove方法）
     */
    hideAnnotations:function(){
    	this.annotationsVisible = false;
    	this.removeAllAnnotations();
    },
    CLASS_NAME: "OpenLayers.Layer.E_Vector"
});