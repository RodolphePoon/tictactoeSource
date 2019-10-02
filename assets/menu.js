// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {
    ccclass,
    property
} = cc._decorator



@ccclass
class Menu extends cc.Component {

    onLoad() {}

    start() {
        let button = this.node.getComponent(cc.Button)
        button.node.on('click', this.startGame, this)

    }

    startGame(e) {
        cc.director.loadScene("game");
    }

    update(dt) {}


}