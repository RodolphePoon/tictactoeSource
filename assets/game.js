// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const convertToTileCoordinate = ({
    width,
    height
}, {
    x,
    y
}) => ({
    x: Math.floor(Math.max(x, 0) / width),
    y: Math.floor(Math.max(y, 0) / height)
})


const randomBetweenTwo = (min, max) => Math.floor(Math.random() * max) + min

const {
    ccclass,
    property
} = cc._decorator

const CROSS = 2
const CIRCLE = 3

const checkWin = (matrix) => {
    let diagonal1 = (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) ? matrix[2][2] : false
    let diagonal2 = (matrix[0][2] === matrix[1][1] && matrix[1][1] === matrix[2][0]) ? matrix[2][0] : false
    let ligne1 = (matrix[0][0] === matrix[0][1] && matrix[0][1] === matrix[0][2]) ? matrix[0][2] : false
    let ligne2 = (matrix[1][0] === matrix[1][1] && matrix[1][1] === matrix[1][2]) ? matrix[1][2] : false
    let ligne3 = (matrix[2][0] === matrix[2][1] && matrix[2][1] === matrix[2][2]) ? matrix[2][2] : false
    let column1 = (matrix[0][0] === matrix[1][0] && matrix[1][0] === matrix[2][0]) ? matrix[2][0] : false
    let column2 = (matrix[0][1] === matrix[1][1] && matrix[1][1] === matrix[2][1]) ? matrix[2][1] : false
    let column3 = (matrix[0][2] === matrix[1][2] && matrix[1][2] === matrix[2][2]) ? matrix[2][2] : false


    return [diagonal1,
        diagonal2,
        ligne1,
        ligne2,
        ligne3,
        column1,
        column2,
        column3,
    ].find(e => !!e)


}


@ccclass
class Game extends cc.Component {


    currentPlayer
    end = false


    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyDown, this);

        this.currentPlayer = 1
        this.reset()


    }

    reset() {
        let tilemap = this.getComponent(cc.TiledMap);
        let {
            height,
            width
        } = tilemap.getMapSize()
        let layer = tilemap.getLayer('game')
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                layer.setTileGIDAt(0, i, j)
            }
        }
    }

    onKeyDown(e) {
        if (cc.macro.KEY.r) { // press R to reset
            this.reset()
        }


    }

    start() {
        let tilemap = this.getComponent(cc.TiledMap);
        let {
            height,
            width
        } = tilemap.getMapSize()

        let matrix = []
        for (let i = 0; i < width; i++) {
            matrix[i] = []
            for (let j = 0; j < height; j++) {
                matrix[i][j] = 0
            }
        }


        this.node.on(cc.Node.EventType.MOUSE_DOWN, (e) => {
            let nodeLocation = this.node.convertToNodeSpaceAR(e.getLocationInView())
            let tilePos = convertToTileCoordinate(tilemap.getTileSize(), nodeLocation)
            let tile = tilemap.getLayer('game').getTileGIDAt(tilePos.x, tilePos.y)
            if (tile === 0 && !this.end) {
                tilemap.getLayer('game').setTileGIDAt(this.currentPlayer == 1 ? CROSS : CIRCLE, tilePos.x, tilePos.y)

                matrix[tilePos.y][tilePos.x] = this.currentPlayer

                let winner = checkWin(matrix)

                if (winner) {
                    this.end = true
                    cc.director.loadScene("main", (e, scene) => {
                        let winnerText = scene.getChildByName('winner')
                        winnerText.getComponent(cc.RichText).string = `<color=#00ff00>${winner} won</c>`


                    });
                } else {
                    let lastPlayer = this.currentPlayer
                    this.currentPlayer = lastPlayer == 1 ? 2 : 1
                }


            }




        }, this)
    }

    update(dt) {}


}