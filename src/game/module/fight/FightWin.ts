/*
 * @Author: zhoulanglang 
 * @Date: 2020-12-21 18:14:48 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 18:17:00
 */
class FightWin extends BaseEuiView {

    private wordGrp: eui.Group
    private mapGrp: eui.Group
    private mapView: MapView
    private bar: eui.ProgressBar
    private heart1: eui.Image
    private heart2: eui.Image
    private heart3: eui.Image
    private heart4: eui.Image
    private heart5: eui.Image
    private flower1: eui.Image
    private flower2: eui.Image
    private flower3: eui.Image
    private bg: eui.Image
    private bg2: eui.Image
    private bgm: string = null
    constructor() {
        super();
        this.skinName = `FightSkin`;
    }

    public open(...param: any[]): void {
        this.observe(FightModel.ins().postRound, this.upRound)
        this.observe(FightModel.ins().postHp, this.upHp)
        this.observe(FightModel.ins().postFlower, this.upFlower)
        this.observe(FightModel.ins().postMonster, this.upMonster)
        this.upView()
    }

    private upView() {
        if (this.mapView == null) {
            this.mapView = FightManager.ins().mapView
            this.mapGrp.addChild(this.mapView)
        }
        this.upBg()
        this.upHp()
        this.upFlower()
    }

    private upRound() {
        this.upBg()
        this.upWord()
        //僵尸
        // this.testMonster()
    }

    private async upMonster() {  //僵尸
        let zombilesdata = FightManager.ins().curZombie//当前回合僵尸
        let action = ["shuangbaotaidh", "newAnimation_qianbanduan", "newAnimation_houbanduan", "newAnimation_zanting", "newAnimation_diaoshou"]

        let data = FightData.zombieData
        for (let i = 0; i < zombilesdata.length; i++) {
            let zombile = zombilesdata[i]
            await TimerManager.ins().deleyPromisse(zombile.ms)
            let k = zombile.nameN
            let monster = new MonsterItem()
            this.mapView.addEntity(monster, zombile.posy)
            let obj = {
                rate: data[k].rate, name: data[k].skeName, actions: action, sx: 1450, tx: 50,
                posy: zombile.posy, index: zombile.index, index2: zombile.index2, isSuper: data[k].isSuper,
                dx: data[k].dx, ms: data[k].ms, dy: data[k].dy,
            }
            monster.objData = obj
            monster.start()
            monster.setCall(this.monsterCall.bind(this))
        }
    }

    private async testMonster() {
        let zombilesdata = FightManager.ins().curZombie//当前回合僵尸

        // let skeName = ["shaungbaotai", "fengmaozi", "pukebaise", "pukdh", "tuzidonghaua", "btuzidonghaua"]
        let action = ["newAnimation_qianbanduan", "newAnimation_houbanduan", "newAnimation_zanting", "newAnimation_diaoshou"]
        let monster = new MonsterItem()
        let posy = 0
        this.mapView.addEntity(monster, posy)

        let data = FightData.zombieData
        let i = 0
        let k = 5
        let obj = {
            rate: data[k].rate, name: data[k].skeName, actions: action, sx: 1000, tx: 500,
            posy: posy, index: zombilesdata[i].index, index2: zombilesdata[i].index2, isSuper: data[k].isSuper,
            dx: data[k].dx, ms: data[k].ms, dy: data[k].dy,
        }
        monster.objData = obj
        monster.start()
        monster.setCall(this.monsterCall.bind(this))
    }
    private monsterCall(item: MonsterItem) {
        let pos = FightData.getGridPosX(item.x, item.objData.posy)
        if (!pos) {
            return 0
        }
        let p = pos.nx + pos.ny * 8
        if (this.grids[p]) {
            TimerManager.ins().doTimer(500, 1, () => { //
                DisplayUtils.removeFromParent(this.grids[p])
                this.grids[p] = null
            }, this)
            let index = item._fallhead ? item.objData.index2 : item.objData.index
            let bool = false
            if (FightManager.ins().round == FightRound.ROUND3) {
                let subw1 = FightModel.ins().words[this.grids[p].data.index].subWord.subWord
                let subw2 = FightModel.ins().words[index].subWord.subWord
                bool = subw1 == subw2
            }
            if (this.grids[p].data.index == index || bool) {
                return 1
            }
            return 2
        }
        else {
            return 0
        }
    }

    private upBg() {
        let bgType = FightManager.ins().sceneType
        if (bgType == SceneType.TYPE1) {
            this.bg.source = 'bg_png'
            this.bg2.source = 'bg_static2_png'
        }
        else if (bgType == SceneType.TYPE2) {
            this.bg.source = 'bg2_png'
            this.bg2.source = ''
        }
        let bgm = FightData.getBgMusic()
        if (this.bgm != bgm) {
            this.bgm = bgm
            SoundManager.ins().playBg(this.bgm)
        }
    }

    private upHp() {
        let hp = FightModel.ins().hp
        for (let i = 1; i <= FightModel.ins().maxHp; i++) {
            let obj = this['heart' + i] as eui.Image
            if (hp >= i) {
                obj.visible = true
            }
            else {
                obj.visible = false
            }
        }
    }

    private upFlower() {
        let fl = FightModel.ins().flower
        let val = FightModel.ins().zombieBar * 100
        this.bar.value = val
        for (let i = 1; i <= FightModel.ins().maxFlower; i++) {
            let obj = this['flower' + i] as eui.Image
            if (fl >= i) {
                obj.visible = true
            }
            else {
                obj.visible = false
            }
        }
    }

    private upWord() {
        this.wordGrp.removeChildren()
        this.removeGrids()
        let words = FightModel.ins().words
        let round = FightManager.ins().round
        for (let i = 0; i < words.length; i++) {
            let word = words[i]
            let data = { type: round, word: word, index: i }
            let item = new WordItem()
            item.x = 0 + item.width / 2
            item.y = i * 137 + item.height / 2
            this.wordGrp.addChild(item)
            item.data = data
            item.setCallBack(this.callGrid.bind(this))
        }
    }



    private callGrid(data: { data, point }) {
        let item = new GridItem()
        let pos = FightData.getGridPos(data.point.x + this.wordGrp.x, data.point.y + this.wordGrp.y)
        if (pos == null) {
            return
        }
        let p = pos.nx + pos.ny * 8
        if (this.grids[p]) {
            return
        }
        let xy = FightData.getGridXY(pos.nx, pos.ny)
        item.x = xy.x
        item.y = xy.y
        let mapView = FightManager.ins().mapView
        mapView.dropLayer.addChild(item)
        item.data = data.data
        this.grids[p] = item
    }

    private grids: GridItem[] = []
    private removeGrids() {
        for (let item of this.grids) {
            DisplayUtils.removeFromParent(item)
        }
        this.grids = []
    }


    public close(...param: any[]): void {
        SoundManager.ins().stopBg()
        this.bgm = null
    }

}
ViewManager.ins().reg(FightWin, LayerManager.UI_Main);