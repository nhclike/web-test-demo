

var ocxPlay={
    obj:null,   //ocx对象
    gWndId:0,   //主窗口
    curWnd:-1,  //当前播放串口
    wndNum:4,   //窗口数量
    _initOcx:function () {
        try
        {
            var ocxObj = new ActiveXObject("DPSDK_OCX.DPSDK_OCXCtrl.1");
        }
        catch(e)
        {
            alert("安装ocx");
            return;
        }
        this.obj = document.getElementById("DPSDK_OCX");
        //登录
        var loginStatus=this.loginServer();
        /*if(loginStatus!=0){
          alert("登录平台失败，请联系管理员");
          return ;
        }*/
        this.gWndId = this.obj.DPSDK_CreateSmartWnd(0, 0, 100, 100); //设置主窗口
        this.obj.DPSDK_SetWndCount(this.gWndId, this.wndNum);   //设置窗口数量
        this.obj.DPSDK_SetWndStyle(1)	;      //设置窗口风格
        this.obj.DPSDK_SetSelWnd(this.gWndId, this.curWnd);  //设置当前窗口
    },
    loginServer:function () {
        var dss = this.dssInfo;
        var result = this.obj.DPSDK_Login("199.138.1.14", "9000", "system", "jsgyjsc");
        if(result==0){
            console.log("登录成功");
        }
        else{
            console.log("登录失败"+result);
        }
        return result;
    },
    logoutServer:function () {
        console.log(this.obj);
        if(!this.obj){
            return ;
        }
        var result = this.obj.DPSDK_Logout();
        if(result==0){
            console.log("登出成功");
        }
        else{
            console.log("登出失败"+result);
        }
    },
    startPlayByWndNo:function (wndId) {  //实时播放
        this.setPlayWnd();   //设置播放窗口
        var nWndNo = this.obj.DPSDK_GetSelWnd(this.gWndId); //获得当前需要播放的窗口
        this.setToolbar();
        var	nResult = this.obj.DPSDK_DirectRealplayByWndNo(this.gWndId,nWndNo, wndId, 1, 1, 1);//开始播放
        this.obj.DPSDK_SetOsdTxtByWndNo (this.gWndId,nWndNo,"正在连接");
        console.log("startPlay"+nResult);
        if(nResult==0){
            console.log("播放成功");

        }else{
            console.log("播放失败");
            this.obj.DPSDK_StopRealplayByWndNo(this.gWndId,nWndNo);

        }
        this.obj.DPSDK_CleanUpOsdInfoByWndNo(this.gWndId,nWndNo);
    },

    startPlayByTime:function (szCameraId,nStartTime,nEndTime,sType) {  //根据时间记录回放
        this.setPlayWnd();   //设置播放窗口
        var nWndNo = this.obj.DPSDK_GetSelWnd(this.gWndId);
        this.setToolbar();
        var	nResult = this.obj.DPSDK_StartTimePlaybackByWndNo(this.gWndId,nWndNo, szCameraId, sType,Number(nStartTime) , Number(nEndTime));
        this.obj.DPSDK_SetOsdTxtByWndNo (this.gWndId,nWndNo,"正在连接");
        console.log("startPlayByTime"+nResult);
        if(nResult==0){
            console.log("播放成功");
        }else{
            console.log("播放失败"+nResult);
            this.obj.DPSDK_StopPlaybackByWndNo(this.gWndId,nWndNo);
        }
        this.obj.DPSDK_CleanUpOsdInfoByWndNo(this.gWndId,nWndNo);

    },
    setPlayWnd:function () {  //设置播放窗口
        var index=this.getWndIndex();
        this.curWnd=index;
        console.log(this.curWnd+"this.curWnd");
        this.obj.DPSDK_SetSelWnd(this.gWndId, this.curWnd);  //设置当前窗口

    },
    getWndIndex:function () {
        var index=0;
        if(this.curWnd>=0 && this.curWnd<this.wndNum-1){
            index=++this.curWnd;
        }else {
            index=0;
        }
        return index;
    },
    stopAllPlay:function () { //停止所有视频预览
        this.obj.DPSDK_StopAllPlay(this.gWndId);
    },
    setToolbar:function () {
        //设置导航栏显示x
        this.obj.DPSDK_SetToolBtnVisible(5, true);
        this.obj.DPSDK_SetControlButtonShowMode(1, 1);
    }

};


//window.onunload=ocxPlay.logoutServer();   //页面关闭退出服务