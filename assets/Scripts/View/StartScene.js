var DataManager = require("DataManager");
var SoundManager = require("SoundManager");
var HttpManager = require("HttpManager");

cc.Class({
    extends: cc.Component,

    properties: {
        loginNode:    cc.Node,
        
        nameLay:      cc.Node,
        nameEdit:     cc.EditBox,
        nameTip:      cc.Label,
        
        passwordLay:  cc.Node,
        passwordEdit: cc.EditBox,
        passwordTip:  cc.Label,

        passwordLay2:  cc.Node,
        passwordEdit2: cc.EditBox,
        passwordTip2:  cc.Label,

        chooseNode:   cc.Node,

        titleLab:     cc.Label,

        loginBtn:     cc.Button,
        registerBtn:  cc.Button,

        _customPop:   null,
        _nameIsValid: false,
        _pswdIsValid: false,
    },

    start () {
    },

    onLoad: function(){
        GameManager.SoundManager = new SoundManager(); 
        GameManager.DataManager = new DataManager();
        GameManager.HttpManager = new HttpManager();

        var isEffectOn = UserDefault.getBool("effectOn");
        var isMusicOn  = UserDefault.getBool("musicOn");

        GameManager.SoundManager.setEffectOn(isEffectOn);
        GameManager.SoundManager.setMusicOn(isMusicOn);
        // GameManager.SoundManager.playMusic("背景乐_01");

        var self = this;

        this.loginNode.active = false;
        this.chooseNode.active = false;

        this.nameTip.node.active = false;

        var userInfo = GameManager.DataManager.getUserInfo();
        cc.log(userInfo);
        if( (!userInfo.userID || userInfo.userID == "null" || userInfo.userID == "" ) || (!userInfo.password || userInfo.password == "null" || userInfo.password == "" ) ){
            this.chooseNode.active = true;
        }else{
            this.nameEdit.string     = userInfo.userID;
            this.passwordEdit.string = userInfo.password;

            this.onLoginIn();
        }
    },

    onLoginIn: function(){
        var logindata = {
            command: "login",
            userName:   this.nameEdit.string,
            password: this.passwordEdit.string
        }

        if( logindata.userID == "" || logindata.password == "" ){
            var tip = {
                title: "提示",
                content: "请输入账号或密码！"
            }
            this.showPop(tip);
            return;
        }

        cc.log(logindata);
        var self = this;
        GameManager.HttpManager.login(logindata,(data)=>{

            GameManager.DataManager.userInfo.gold     = data["gold"];
            GameManager.DataManager.userInfo.diamond  = data["diamond"];
            GameManager.DataManager.userInfo.gunIndex = data["gunIndex"];
            GameManager.DataManager.userInfo.userID   = data["userName"];
            GameManager.DataManager.userInfo.password = data["password"];
            GameManager.DataManager.saveUserInfo();

            self.loginNode.active = false;
        },function(data){
            var info = {
                title: "提示",
                content: data,
            }
            self.showPop(info);
        });
    },

    onNameEditEnd: function(){
        var name = this.nameEdit.string;
        cc.log(name.replace(/[^\w\.\/]/ig,''))
        if( name == "" ){
            this.nameTip.string = "请输入账号"
            this.nameTip.node.active = true;
            this._nameIsValid = false;
            return;
        }
        if( name != name.replace(/[^\w\.\/]/ig,'') ){
            this.nameTip.node.active = true;
            this.nameTip.string = "必须字母、数字和下划线";
            this._nameIsValid = false;
            return;
        }

        if( name.length < 4 ){
            this.nameTip.node.active = true;
            this.nameTip.string = "至少是4个字符";
            this._nameIsValid = false;
            return;
        }

        this.nameTip.node.active = false;
    },

    onPasswordEditEnd: function(){
        var password = this.passwordEdit.string;
        var result = this.checkPasswordIsValid(password);
        this.passwordTip.string = result;
        cc.log("onPasswordEditEnd");
    },

    onPasswordEdit2End: function(){
        var password1 = this.passwordEdit.string;
        var password2 = this.passwordEdit2.string;

        if( password1 != password2 ){
            this.passwordTip2.string = "两次密码不一致";
            return;
        }

        var result = this.checkPasswordIsValid(password2);
        this.passwordTip2.string = result;
        cc.log("onPasswordEdit2End");
    },

    checkPasswordIsValid: function(password){
        if( password == "" ){
            return "请输入密码";
        }
        if( password == password.replace(/[^/d]/g,'') ){
            return "必须是数字";
        }
        if( password.length < 8 ){
            return "至少是8位数";
        }

        return "";
    },

    onNewGame: function(){
        cc.director.loadScene("MainScene");
        GameManager.SoundManager.playEffect("后台按键音_01");
    },

    onOldGame: function(){
        cc.director.loadScene("MainScene");
        GameManager.SoundManager.playEffect("后台按键音_01");
    },

    onDestroy: function(){
        GameManager.SoundManager.stopMusic();
    },

    onChooseLoginClicked: function(){
        this.loginNode.active = true;
        this.chooseNode.active = false;
        this.titleLab.string = "登 陆";
        this.passwordLay2.active = false;
        this.nameLay.position = cc.v2(0,48);
        this.passwordLay.position = cc.v2(0,-30);
        this.loginBtn.node.active = true;
        this.registerBtn.node.active = false;
    },

    onChooseRegisterClicked: function(){
        this.loginNode.active = true;
        this.chooseNode.active = false;
        this.titleLab.string = "注 册";
        this.passwordLay2.active = true;
        this.nameLay.position = cc.v2(0,69);
        this.passwordLay.position = cc.v2(0,4);
        this.loginBtn.node.active = false;
        this.registerBtn.node.active = true;
    },

    onLoginClicked: function(){
        GameManager.SoundManager.playEffect("后台按键音_01");
        this.onLoginIn();
    },

    onRegisterClicked: function(){
        GameManager.SoundManager.playEffect("后台按键音_01");

        var password1 = this.passwordEdit.string;
        var password2 = this.passwordEdit2.string;

        if( password1 != password2 ){
            var tip = {
                title: "提示",
                content: "两次密码不一致！"
            }
            this.showPop(tip);
            return;
        }

        var registerData = {
            command:  "register",
            userName:   this.nameEdit.string,
            password: this.passwordEdit.string
        }

        if( registerData.userID == "" || registerData.password == "" ){
            var tip = {
                title: "提示",
                content: "请输入账号或密码！"
            }
            this.showPop(tip);
            return;
        }

        var self = this;
        GameManager.HttpManager.register(registerData,function(data){
            var info = {
                title: "提示",
                content: data,
            }
            self.showPop(info);
        },function(data){
            var info = {
                title: "提示",
                content: data,
            }
            self.showPop(info);
        });
        
    },

    showPop: function(data,func){
        var self = this;
        if( self._customPop ){
            self._customPop.getComponent("CustomPop").show(data,func)
        }else{
            cc.loader.loadRes("Prefabs/CustomPop",function(err,prefab){
                if( err ){
                    return;
                }
                self._customPop = cc.instantiate(prefab);
                self.node.addChild(self._customPop, 999)
                self._customPop.getComponent("CustomPop").show(data,func);
            });
        }
    },

    onCloseClicked: function(){
        this.loginNode.active     = false;
        this.chooseNode.active    = true;
        this.passwordEdit.string  = "";
        this.passwordEdit2.string = "";
        this.nameEdit.string      = "";
        this.passwordTip.string   = "";
        this.passwordTip2.string  = "";
        this.nameTip.string       = "";
    },
});
