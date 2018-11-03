

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,

        btn1: cc.Button,
        btn2: cc.Button,

        lay1: cc.Node,
        lay2: cc.Node,

        DiamondItem: [cc.Node],
        GoldItem: [cc.Node],
    },

    onLoad: function(){
        this.initItem();
        this.changeLay(1);
    },

    show: function(){
        this.bg.stopAllActions();
        this.node.active = true;
        var desPos = cc.v2(0,-30);
        var desPos2 = cc.v2(0,0);
        var moveAct = cc.moveTo(0.2,desPos);
        var moveAct2 = cc.moveTo(0.1,desPos2);
        this.bg.runAction(cc.sequence(moveAct,moveAct2));
    },

    hide: function(){
        this.bg.stopAllActions();
        var desPos = cc.v2(0,-30);
        var desPos2 = cc.v2(0,360+this.bg.height/2);
        var moveAct = cc.moveTo(0.1,desPos);
        var moveAct2 = cc.moveTo(0.2,desPos2);
        var self = this;
        this.bg.runAction(cc.sequence(moveAct,moveAct2,cc.callFunc(function(){
            self.node.active = false;
        })));
    },

    onTypeClicked: function(event,customData){
        cc.log(customData);
        this.changeLay(customData);
    },

    initItem: function(){
        var config =  GameManager.DataManager.getShopConfig();
        var diamondConfig = config.diamond;
        var goldConfig    = config.gold;

        cc.log(diamondConfig);

        for( var i=0; i<this.DiamondItem.length; i++ ){
            let item = this.DiamondItem[i];
            let name = item.getChildByName("name");
            name.getComponent(cc.Label).string = diamondConfig[i].name;
            let num = item.getChildByName("num");
            num.getComponent(cc.Label).string = diamondConfig[i].num;
            let cost = item.getChildByName("cost");
            cost.getComponent(cc.Label).string = diamondConfig[i].cost;
        }

        cc.log(goldConfig);
        for( var j=0; j<this.GoldItem.length; j++ ){
            let item = this.GoldItem[j];
            let name = item.getChildByName("name");
            name.getComponent(cc.Label).string = goldConfig[j].name;
            let num = item.getChildByName("num")
            num.getComponent(cc.Label).string = goldConfig[j].num;
            let cost = item.getChildByName("cost")
            cost.getComponent(cc.Label).string = goldConfig[j].cost;
        }
    },

    changeLay: function(type){
        if( type == 1 ){
            this.lay1.active = true;
            this.lay2.active = false;
            this.btn1.interactable = false;
            this.btn2.interactable = true;
        }else{
            this.lay1.active = false;
            this.lay2.active = true;
            this.btn1.interactable = true;
            this.btn2.interactable = false;
        }
    },
});