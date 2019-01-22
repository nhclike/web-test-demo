/**
 * Created by lij on 2018/9/12.
 */
var data=['长江场-东风场1','长江场-东风场2','长江场-东风场3','长江场-东风场4','长江场-东风场5'];
var dataLength=data.length;
var view_width=450;
var view_num=3;
var li_width=150;
var ul_width=li_width*dataLength;
var curIndex=0;
var ulEle=$('.scroll-list>ul');
var header_index_flag=-1;
var footer_index_flag=-2
//init
$(ulEle).width(ul_width+'px');

var  str='';
for(var i=0; i<dataLength;i++){
    str+='<li>'+
        '<span>'+data[i]+'</span>'+
        '</li>'
}
$(ulEle).html(str);
var maxOffset=(dataLength-view_num)*li_width;
var setOffsetX=0;

$('.prev').click(function () {
    if(curIndex==header_index_flag){
        curIndex=0
    }
    if(curIndex==footer_index_flag){
        return;
    }
    curIndex++;
    setOffsetX=curIndex*li_width;
    if(setOffsetX>maxOffset){
        curIndex=footer_index_flag;
        return
    }
    $(ulEle).css('left','-'+setOffsetX+'px');

})
$('.next').click(function () {
    if(curIndex<0){
        if(curIndex==header_index_flag){
            return ;
        }
        if(curIndex==footer_index_flag){
            curIndex=dataLength-view_num;
        }
    }
    curIndex--;
    setOffsetX=curIndex*li_width;
    if(setOffsetX==0){
        curIndex=header_index_flag;
        return
    }
    $(ulEle).css('left','-'+setOffsetX+'px');
})