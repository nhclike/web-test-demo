
$(document).ready(function() {
  var tel='';
  //loadContactList();
  $('.numbers').focus(function () {
    $(this).val('');
    tel=''
  });
  $('.numbers').keyup(function (event) {
    var e = event || window.event;
    var k = e.keyCode || e.which;
    console.log(k);
    if(!(k >= 48 && k <= 57)||$(this).val().length>15){ //输入的不是数字或者超出了15个字符就截断
      var  numbers=$(this).val();
      var  numbers2=$(this).val().length;
      var text=numbers.substr(0, numbers2 - 1);
      $(this).val(text)
    }
  });
  //触发搜索
  $("#contact-meeting #searchPhone").keyup(function(){
    var value = $(this).val();
    console.log("value"+value);
    searchContact(value);
  });

  $(window).load(function() {
    $("#dial-meeting .phone-pic").hide();
    $("#dial-meeting .cover").hide();
    $("#dial-meeting .btn-hang-up").hide();
  });

	/*	Delete */
  $('#dial-meeting .btn-del').click(function() {

    var numbers = $('#dial-meeting .number-area .numbers').val();
    var numbers2 = $('#dial-meeting .number-area .numbers').val().length;
    var curVal=numbers.substr(0, numbers2 - 1);
    tel=curVal;
    $('#dial-meeting .number-area .numbers').val(curVal);
  });

	/*	Pusher	*/
  var pusher = {
    number: function(num) {
      // 点击数字
      $('#dial-meeting .numbers-container .pushed' + num + '').click(function() {
        if($('#dial-meeting .number-area .numbers').val().length<=15){
          tel+=num;
          $('#dial-meeting .number-area .numbers').val(tel)
        }


      });
    }
  }

  pusher.number(1);
  pusher.number(2);
  pusher.number(3);
  pusher.number(4);
  pusher.number(5);
  pusher.number(6);
  pusher.number(7);
  pusher.number(8);
  pusher.number(9);
  pusher.number(0);

  $('#dial-meeting .numbers-container .pushedasterisk').click(function() {
    if($('#dial-meeting .number-area .numbers').val().length<=15){
      tel+='*';
      $('#dial-meeting .number-area .numbers').val(tel)

    }

  });


  $('#dial-meeting .numbers-container .pushednumber').click(function() {
    if($('#dial-meeting .number-area .numbers').val().length<=15){
      tel+='#';
      $('#dial-meeting .number-area .numbers').val(tel)

    }

  });

});

var contactInfos = [];  //通讯录数据
var searchInfos = [];  //搜索结果
var sign = false;      //操作隐藏

function opt(obj)
{
  if(sign){
    //显示操作按钮
    $(obj).parents(".contact-info").removeClass("no-border").siblings(".contact-opt").hide();
    sign = false;
  }else{
    //隐藏操作按钮
    $(obj).parents(".contact-info").addClass("no-border").siblings(".contact-opt").show();
    sign = true;
  }
  return false;
}

//点击呼叫
function call(obj)
{
  $("#dial-meeting .numbers").hide();
  $(obj).hide();
  $("#dial-meeting .phone-pic").show();
  $("#dial-meeting .cover").show();
  $("#dial-meeting .btn-hang-up").show();
  //callMember($('#dial-meeting .number-area .numbers').html());
}

//点击挂断
function hangup(obj)
{
  $(obj).hide();
  $("#dial-meeting .cover").hide();
  $("#dial-meeting .phone-pic").show();
  $("#dial-meeting .btn-dial").show();
  $("#dial-meeting .numbers").show();
}

//邀请用户
function callMember(telphone)
{
  $.ajax({
    url : ctx + '/voice/joinToConferenceByTel',
    method: 'post',
    dataType : 'json',
    data: {
      'code' : code,
      'telphone' : telphone
    },
    success: function(res)
    {
      if(res.code == 1){
        var members = res.data.members;
        if(res.data.checkInfo.status == 0)
        {
          hangup($('#call-meeting #hangupbtn'));
          var telIsExist=$("#members-ul").find('#'+telphone); //查找人员列表中的电话
          if(telIsExist.length==1){ //所拨打的号码已近在人员列表中
            $.messager.alert("系统提示","此号码已存在,请勿重复拨打","info");

            return;
          }

          loadMembersInfoToHtmlPage(members);
          $('#hideBox-meeting').click();
        }else {
          setTimeout(showAutoMessage("通话失败，单兵不在线或正在使用中"), 5000);
          hangup($('#call-meeting #hangupbtn'));
        }
      }else
      {
        $.messager.alert("系统提示","通话失败，单兵不在线或正在使用中","info");
      }

    }
  });
}

//追加新成员 暂时不用
function loadNewMemberInfoToHtmlPage(member, telphone)
{
  //追加新成员
  var memberstr = '';
  memberstr +='' +
    '	<li>' +
    '<i class="fa fa-user icon-size user"></i><span title="'+member.username+'['+member.telephone+']">'+member.username+'['+member.telephone+']</span>' +
    '<div class="operate-up">' +
    '	<i title="视频" class="fa fa-video-camera icon-size video" onclick="playVideo(\''+member.domid+'\', \''+member.devcode+'\')"></i>' +
    '	<i title="发言" class="fa fa-microphone icon-size telphone"></i>' +
    '	<i title="踢出" class="fa fa-times-circle icon-size kick" onclick="eliminateMember(\''+member.domid+'\', \''+member.devcode+'\', this)"></i>' +
    '</div>' +
    '</li>' ;

  $('#members-ul').append(memberstr);
}

//初始化通讯录
function initContactList()
{
  var str = '';
  for(var i=0 ; i< contactInfos.length; i++)
  {
    str +=
      '<li>' +
      '<!-- 联系人信息 -->' +
      '<div class="contact-info" ondblclick="doubleClickDial(this)">' +
      '<div class="fa fa-user icon-size contact-img"></div>' +
      '<div class="contact-name">' +
      '<p class="info-name">'+contactInfos[i].name+'</p>' +
      '<p class="info-phone">'+contactInfos[i].num+'</p>' +
      '</div>' +
      '</div>' +
      '</li>';
  }
  $('#contact-meeting #contact-list').html(str);
}

//加载通讯录数据
function loadContactList()
{
  $.ajax({
    url: ctx + '/meeting/getContactInfos',
    method: 'post',
    dataType : 'json',
    success: function(res){
      if(res.code == 1){
        contactInfos = res.data.contactInfos;
        initContactList();
      }
    }
  });
}
//搜索联系人
function searchContact(value){
  searchInfos = [];
  if(value){
    for(var i=0;i<contactInfos.length;i++){
      if(contactInfos[i].num.indexOf(value) > -1){
        searchInfos.push(contactInfos[i].num);
      }
    }
    if(searchInfos.length){
      var str = '';
      for(var i=0 ; i< contactInfos.length; i++){
        for(var j=0 ; j< searchInfos.length; j++){
          if($.trim(searchInfos[j]) == contactInfos[i].num ){
            str +=
              '<li>' +
              '<!-- 联系人信息 -->' +
              '<div class="contact-info" ondblclick="doubleClickDial(this)">' +
              '<div class="fa fa-user icon-size contact-img"></div>' +
              '<div class="contact-name">' +
              '<p class="info-name">'+contactInfos[i].name+'</p>' +
              '<p class="info-phone">'+contactInfos[i].num+'</p>' +
              '</div>' +
              '</div>' +
              '</li>';
          }
        }
      }
      $('#contact-meeting #contact-list').html(str);
    }else{
      $('#contact-meeting #contact-list').html('<div class="result-info">无搜索结果</div>');
    }
  }else{
    initContactList();
  }
}
//双击联系人拨号
function doubleClickDial(obj){
  //console.log("$(obj)"+$(obj));

  var number = $(obj).find(".info-phone").text();
  //console.log(number);
  $('#dial-meeting .number-area .numbers').html(number);
  $('#contactTab a[href="#dial-meeting"]').tab('show');
}










