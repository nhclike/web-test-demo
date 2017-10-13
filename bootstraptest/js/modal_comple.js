/**
 * Created by lij on 2017/10/12.
 */
function initView(_box){
  var $p = $(_box || document);

  $('a[target="dialog"]', $p).each(function(event){
    $(this, $p).unbind('click').click(function(event){
      openModal(event);
    });
  });
}


/**关闭modal*/
function hideModal(obj){
  var modal = $(obj).parents("div.modal");
  if(modal.length > 0){
    modal.remove();
    initView();
  }
}
/**打开modal*/
function openModal(event){
//	var this = $(this);
  var $this = $(event.currentTarget);
  var _url = $this.attr("data-url");
  var _title = $this.attr("title");
  var _id;

  _id = dialog.content();

  var options = {
    backdrop: false,
    keyboard: true,
    show: true
  };
  $('#' + _id).modal(options);
  var modal = $('#' + _id);
  if(typeof(_title) != "undefined"){
    if(modal.find('.modal-title').length <= 0){
      var header = dialog.header({title : _title});
      $($.parseHTML(header)).appendTo(modal.find(".modal-content"));
    }else{
      modal.find('.modal-title').text(_title);
    }
    if(modal.find('.modal-body').length <= 0){
      var _body = dialog.body;
      $($.parseHTML(_body)).appendTo(modal.find(".modal-content"));
    }
    modal.find(".modal-body").load(_url, $.proxy(function () {
      modal.trigger('loaded.bs.modal');
      initView();
    }, this));
  }else{
    modal.find(".modal-content").load(_url, $.proxy(function () {
      modal.trigger('loaded.bs.modal');
      initView();
    }, this));
  }
  //阻止事件默认行为
  event.preventDefault();
}

//modal model
//TO STRAT
if(!$(window).data("_modal_id")){
  $(window).data("_modal_id", 0);
}
var dialog = {
  header : function(options){
    var template = '<div class="modal-header">'
      +	'<button type="button" class="close" aria-label="Close" onclick="hideModal(this);"><span aria-hidden="true">×</span></button>'
      +	'<h4 class="modal-title">' + options.title + '</h4>'
      +'</div>';
    return template;
  },
  content : function(){
    var _modal_id = $(window).data("_modal_id");
    var _id = "_modal_id_" + _modal_id;
    _modal_id ++;
    $(window).data("_modal_id", _modal_id);

    var template = '<div class="modal fade" tabindex="-1" role="dialog" id="'+ _id +'">'
      +   '<div class="modal-dialog modal-lg" role="document" aria-hidden="true">'
      +		'<div class="modal-content">'
      +	    '</div>'
      +   '</div>'
      +'</div>';
    $(template).appendTo('body');
    initView();
    return _id;
  },
  body : '<div class="modal-body"></div>'
};


