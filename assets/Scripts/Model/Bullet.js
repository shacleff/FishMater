

cc.Class({
    extends: cc.Component,

    properties: {
        damageValue: 0,
        moveSpeed: 100,
        webPrefab: cc.Prefab,
    },

    update: function(dt){
        var rotation = this.node.rotation;
        var vec = Utils.getVectorByAngle(rotation);
        var deltaPos = vec.mul(this.moveSpeed * dt);
        
        this.node.position = this.node.position.add(deltaPos);
    },

    onCollisionEnter: function (other, self) {
        if( other.node.group == "border" ){
            self.node.destroy();
        }else if( other.node.group == "fish" ){
            self.node.destroy();            
            
            var damageValue =  self.node.getComponent("Bullet").damageValue;
           
            var web = cc.instantiate(this.webPrefab);
            web.getComponent("Web").damageValue = damageValue;
            web.parent = self.node.parent;
            web.position = self.node.position;
            
            GameManager.SoundManager.playEffect("FX_wang_01");
        }
    },
});
