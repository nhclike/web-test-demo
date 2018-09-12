var data=['长江场-东风场1','长江场-东风场2','长江场-东风场3','长江场-东风场4','长江场-东风场5'];
var dataLength=data.length;
var li_width=150;
var ul_width=li_width*dataLength;
var ulEle=$('.scroll-list>ul');
//init
$(ulEle).width(ul_width+'px')

var  str='';
for(var i=0; i<dataLength;i++){

  str+='<li>'+
    '<span>'+data[i]+'</span>'+
    '</li>'
}
$(ulEle).html(str);

var offsetX='300px';
$('.prev').click(function () {
  $(ulEle).css('transform','translateX(-'+offsetX+')')
})