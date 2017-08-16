/**
 * 
 */
$(document).ready(function() {
	
	 //loadContactList();
	 
	 //触发搜索
	 $("#searchPhone").keyup(function(){
		 var value = $(this).val();
		 //searchContact(value);
	});
	 	
	 $(window).load(function() {
	 	$(".phone-pic").hide();
		$(".cover").hide();	
		$(".btn-hang-up").hide();	
	 });

	/*	Delete */
	$('.delete-btn').click(function() {
		var numbers = $('.number-area .numbers').text();
		var numbers2 = $('.number-area .numbers').text().length;
		$('.number-area .numbers').text(numbers.substr(0, numbers2 - 1));
	});

	/*	Pusher	*/
	var pusher = {
		number: function(num) {
			// 点击数字 
			$('.numbers-container .pushed'+ num +'').click(function() {
				$('.number-area .numbers').append('' + num + '');
				
			});
            // $('.numbers-container .pushed'+ num +'').on("click",function() {
			// 	$('.number-area .numbers').append('' + num + '');
            //
			// });
		}
	};

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

	$('.numbers-container .pushedasterisk').click(function() {
		$('.number-area .numbers').append('*');
	});

	$('.numbers-container .pushednumber').click(function() {
		$('.number-area .numbers').append('#');
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
	$(".numbers").hide();
	$(obj).hide();
	$(".phone-pic").show();
	$(".cover").show();
	$(".btn-hang-up").show();
	callMember($('.number-area .numbers').html());
}

//点击挂断
function hangup(obj)
{
	$(obj).hide();
	$(".cover").hide();
	$(".phone-pic").show();
	$(".btn-dial").show();
	$(".numbers").show();
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
					hangup($('#hangupbtn'));
					loadMembersInfoToHtmlPage(members);	
					$('#hideBox').click();
				}else {
					setTimeout(showAutoMessage("呼叫失败"), 5000);
					hangup($('#hangupbtn'));
				}
			}else
			{
				alert(res.msg);
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
	$('#contact-list').html(str);
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
			$('#contact-list').html(str);
		}else{
			$('#contact-list').html('<div class="result-info">无搜索结果</div>');
		}
	}else{
		initContactList();
	}
}
//双击联系人拨号
function doubleClickDial(obj){
	var number = $(obj).find(".info-phone").text();
	$('.number-area .numbers').html(number);
	$('#contactTab a[href="#dial"]').tab('show');
}










