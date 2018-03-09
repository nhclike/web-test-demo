/*
 * Magazine sample
*/
function setArrows() {	
	setTimeout(function(){
	var width = $(window).width();
	var bookWidth = $(".magazine").width();
	var arrowSize = $(".next-button").width();
	var magaLeft=$(".magazine").offset().left;
	var nextLeft= (width-bookWidth-magaLeft-60)/2;
	//alert("width "+width +"\nbookWidth :"+bookWidth +"\nmagaLeft:"+magaLeft+"\nnextLeft:"+nextLeft);
	$('.next-button').animate({ "right":nextLeft},300);
	
	$('.previous-button').animate({ "left":nextLeft},300);
	},100);
		
}
function addPage(page, book) {
	 
    var id, pages = book.turn('pages');

    // 创建 单页容器节点
    var element = $('<div />', {});
    // 加入书本
    if (book.turn('addPage', element, page)) {
        element.html('<canvas width='+W+' height='+H+' style="position:absolute;left:0;top:0;display:inline;height:100%;width:100%" id="can'+page+'" class="gradient"></canvas><div class="loader"></div>');
       
        loadPage(page, element);//加载 页面
    }

}


function loadPage(page, pageElement) {
    // 创建img节点
	
    var img = $('<img id = "tup" />');

    img.mousedown(function(e) {
        e.preventDefault();
    });

    img.load(function() {

        // 设置图片铺满
        $(this).css({
            width: '100%',
            height: '100%'
        });

        // 把图片插入 页节点
        $(this).appendTo(pageElement);
        pageElement.find('.loader').remove();
    });

    // 加载  页面图片
   
    img.attr('src',bookurl + '/' + (page - 1) + '.png');
    loadRegions(page, pageElement);

}
// 键盘翻页以及按钮全屏事件
$(document).keydown(function(e) {
	var previous = 37,
		next = 39,
		esc = 27;
	switch(e.keyCode) {
		case previous:
			// 上一页
			$('.magazine').turn('previous');
			e.preventDefault();
			break;
		case next:
			//下一页
			$('.magazine').turn('next');
			//alert(".magazine has " + $('.magazine').turn("pages") + " pages");获取总页数
			e.preventDefault();
			break;
		case esc:
			$('.magazine-viewport').zoom('zoomOut');
			e.preventDefault();
			break;
	}
});
// Zoom in / Zoom out
function zoomTo(event) {

    setTimeout(function() {
        if ($('.magazine-viewport').data().regionClicked) {
            $('.magazine-viewport').data().regionClicked = false;
        } else {
            if ($('.magazine-viewport').zoom('value') == 1) {
                $('.magazine-viewport').zoom('zoomIn', event);
            } else {
                $('.magazine-viewport').zoom('zoomOut');
            }
        }
    },
    1);

}
function loadRegions(page, element) {
    $.getJSON('pages/' + page + '-regions.json').done(function(data) {

        $.each(data,
        function(key, region) {
            addRegion(region, element);
        });
    });
}
function addRegion(region, pageElement) {

    var reg = $('<div />', {
        'class': 'region  ' + region['class']
    }),
    options = $('.magazine').turn('options'),
    pageWidth = options.width / 2,
    pageHeight = options.height;

    reg.css({
        top: Math.round(region.y / pageHeight * 100) + '%',
        left: Math.round(region.x / pageWidth * 100) + '%',
        width: Math.round(region.width / pageWidth * 100) + '%',
        height: Math.round(region.height / pageHeight * 100) + '%'
    }).attr('region-data', $.param(region.data || ''));

    reg.appendTo(pageElement);
}

function regionClick(event) {

    var region = $(event.target);

    if (region.hasClass('region')) {

        $('.magazine-viewport').data().regionClicked = true;

        setTimeout(function() {
            $('.magazine-viewport').data().regionClicked = false;
        },
        100);

        var regionType = $.trim(region.attr('class').replace('region', ''));

        return processRegion(region, regionType);

    }

}

function processRegion(region, regionType) {

    data = decodeParams(region.attr('region-data'));

    switch (regionType) {
    case 'link':

        window.open(data.url);

        break;
    case 'zoom':

        var regionOffset = region.offset(),
        viewportOffset = $('.magazine-viewport').offset(),
        pos = {
            x: regionOffset.left - viewportOffset.left,
            y: regionOffset.top - viewportOffset.top
        };

        $('.magazine-viewport').zoom('zoomIn', pos);

        break;
    case 'to-page':
        $('.magazine').turn('page', data.page);
        break;
    }
}

// 加载大页面
function loadLargePage(page, pageElement) {

    var img = $('<img />');

    img.load(function() {

        var prevImg = pageElement.find('img');
        $(this).css({
            width: '100%',
            height: '100%'
        });
        $(this).appendTo(pageElement);
        prevImg.remove();

    });

    // 主页面加载
    //img.attr('src', 'pages/' + page + '-large.png');

    img.attr('src',bookurl + '/' + (page - 1) + '-large.png')
   
}

// 加载小片
function loadSmallPage(page, pageElement) {

    var img = pageElement.find('img');

    img.css({
        width: '100%',
        height: '100%'
    });

    img.unbind('load');
    // 主图片路径
    img.attr('src',bookurl + '/' + (page - 1) + '.png');
    
}
function isChrome() {

    return navigator.userAgent.indexOf('Chrome') != -1;

}
function disableControls(page) {
    if (page == 1) $('.previous-button').hide();
    else $('.previous-button').show();

    if (page == $('.magazine').turn('pages')) $('.next-button').hide();
    else $('.next-button').show();
}

// 页面视图配置
function resizeViewport() {

    var width = $(window).width(),
    height = $(window).height(),
    options = $('.magazine').turn('options');

    $('.magazine').removeClass('animated');

    $('.magazine-viewport').css({
        width: width,
        height: height
    }).zoom('resize');
    setArrows() ;

    if ($('.magazine').turn('zoom') == 1) {
        var bound = calculateBound({
            width: options.width,
            height: options.height,
            boundWidth: Math.min(options.width, width),
            boundHeight: Math.min(options.height, height)
        });

        if (bound.width % 2 !== 0) bound.width -= 1;

        if (bound.width != $('.magazine').width() || bound.height != $('.magazine').height()) {

            $('.magazine').turn('size', bound.width, bound.height);

            if ($('.magazine').turn('page') == 1) $('.magazine').turn('peel', 'br'); 
            

        }

        $('.magazine').css({
            top: -bound.height / 2,
            left: -bound.width / 2
        });
    }

    var magazineOffset = $('.magazine').offset(),
    boundH = height - magazineOffset.top - $('.magazine').height(),
    marginTop = (boundH - $('.thumbnails > div').height()) / 2;

    if (marginTop < 0) {
        $('.thumbnails').css({
            height: 1
        });
    } else {
        $('.thumbnails').css({
            height: boundH
        });
        $('.thumbnails > div').css({
            marginTop: marginTop
        });
    }

    if (magazineOffset.top < $('.made').height()) $('.made').hide();
    else $('.made').show();

    $('.magazine').addClass('animated');

}

// 剩余页面
function numberOfViews(book) {
    return book.turn('pages') / 2 + 1;
}

//书本中的当前页面
function getViewNumber(book, page) {
    return parseInt((page || book.turn('page')) / 2 + 1, 10);
}
function moveBar(yes) {
	if (Modernizr && Modernizr.csstransforms) {
		$('#slider .ui-slider-handle').css({zIndex: yes ? -1 : 10000});
	}
}

function setPreview(view) {

	var previewWidth = 112,
		previewHeight = 73,
		previewSrc = 'pages/preview.jpg',
		preview = $(_thumbPreview.children(':first')),
		numPages = (view==1 || view==$('#slider').slider('option', 'max')) ? 1 : 2,
		width = (numPages==1) ? previewWidth/2 : previewWidth;

	_thumbPreview.
		addClass('no-transition').
		css({width: width + 15,
			height: previewHeight + 15,
			top: -previewHeight - 30,
			left: ($($('#slider').children(':first')).width() - width - 15)/2
		});

	preview.css({
		width: width,
		height: previewHeight
	});

	if (preview.css('background-image')==='' ||
		preview.css('background-image')=='none') {

		preview.css({backgroundImage: 'url(' + previewSrc + ')'});

		setTimeout(function(){
			_thumbPreview.removeClass('no-transition');
		}, 0);

	}

	preview.css({backgroundPosition:
		'0px -'+((view-1)*previewHeight)+'px'
	});
}

// 等比放大
function largeMagazineWidth() {
    return 2214;
}
function decodeParams(data) {
    var parts = data.split('&'),
    d,
    obj = {};
    for (var i = 0; i < parts.length; i++) {
        d = parts[i].split('=');
        obj[decodeURIComponent(d[0])] = decodeURIComponent(d[1]);
    }
    return obj;
}

function calculateBound(d) {
    var bound = {
        width: d.width,
        height: d.height
    };
    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {
        var rel = bound.width / bound.height;
        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {
            bound.width = Math.round(d.boundHeight * rel);
            bound.height = d.boundHeight;
        } else {
            bound.width = d.boundWidth;
            bound.height = Math.round(d.boundWidth / rel);
        }
    }
    return bound;
}
//文档的缩放;
function fnBigger(){
	var zoom=parseInt($('.magazine')[0].style.zoom, 10)||100;
	zoom+=10;
	if (zoom>0) $('.magazine')[0].style.zoom=zoom+'%';
	
}
function fnSmaller(){
var zoom=parseInt($('.magazine')[0].style.zoom, 10)||100;
zoom-=10;
if (zoom>0) $('.magazine')[0].style.zoom=zoom+'%';

}
