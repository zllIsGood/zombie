/* 战斗管理器
 * @Author: zhoulanglang 
 * @Date: 2020-09-09 14:49:04 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 11:21:31
 */
class FightManager extends BaseClass {
    public static ins(): FightManager {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private _mapView: MapView
    public get mapView() {
        if (this._mapView == null) {
            this._mapView = new MapView()
            this._mapView.initMap()
        }
        return this._mapView
    }

    /**重新开始*/
    public replay() {
        FightModel.ins().clearData()
        this.play()
    }
    /**开始*/
    public async play(guide = false) {
        FightModel.ins().checkWord()
        this.round = 0
        this.zombies = []
        this.nestRound()
        if (guide) {
            this.showGuide()
        }
        FightModel.ins().postMonster()
    }

    public get sceneType(): SceneType {
        if (this.round == FightRound.ROUND2 || this.round == FightRound.ROUND4) {
            return SceneType.TYPE2
        }
        return SceneType.TYPE1
    }
    public round = 0
    public isWin = false
    public zombies = []  //僵尸
    public curZombie  //僵尸
    public curZombieNum: number

    /**H5开始*/
    public async initWords(obj) {
        FightModel.ins().initWords(obj.wordList)
        ViewManager.ins().open(FightWin)
        await TimerManager.ins().deleyPromisse(500)
        this.play(true)
    }

    /**上报结果*/
    public result() {
        if (Main.gamePlatform == Main.platformH5) {
            H5Service.H5Result(this.resultDta.isWin, this.resultDta.flower)
        }
    }
    private resultDta = { isWin: false, flower: 0 } //记录最好结果
    /**结束*/
    public endPlay() {
        this.isWin = FightModel.ins().hp > 0
        if (this.isWin) {
            this.resultDta.isWin = true
            let flower = FightModel.ins().flower
            this.resultDta.flower = flower > this.resultDta.flower ? flower : this.resultDta.flower
        }
        let sound = this.isWin ? 'fight_win_mp3' : 'fight_fail_mp3'
        SoundManager.ins().playEffect(sound)
        ViewManager.ins().open(FightResultWin, this.isWin, FightModel.ins().flower)
    }

    public nestPlay() {
        if (FightModel.ins().hp <= 0 || !this.nestRound()) {
            this.endPlay()
        }
        else {
            FightModel.ins().postMonster()
        }
    }

    private nestRound() {
        if (this.round >= FightRound.ROUND4) {
            return false
        }
        this.round++
        FightModel.ins().postRound()
        this.pushZombies()
        return true
    }

    private pushZombies() {
        let num = FightModel.ins().words.length
        let arr = []
        let indexs = []
        for (let i = 0; i < num; i++) {
            indexs.push(i)
        }
        indexs = MathUtils.randomArray(indexs)
        for (let i = 0; i < num; i++) {
            let index2 = this.getRandom(indexs, i)//Math.floor(Math.random() * num)
            let item = {
                index: indexs[i], index2: index2,
                posy: MathUtils.limitInteger(0, 2), nameN: MathUtils.limitInteger(0, FightData.zombieData.length - 1),
                ms: i == 0 ? 0 : MathUtils.limit(6000, 7000)
            }  //isSuper 超级僵尸
            arr.push(item)
        }
        this.zombies.push(arr)
        this.curZombie = arr
        this.curZombieNum = arr.length
    }

    private getRandom(arr: number[], i: number) {
        if (arr.length == 1) {
            return arr[0]
        }
        let index = Math.floor(Math.random() * (arr.length - 1))
        if (index >= i) {
            index += 1
        }
        return arr[index]
    }

    /**死亡或消除一只僵尸*/
    public zombieDie(isDie = false, i: number, isSuper = false) {
        this.curZombieNum--
        if (isDie) {
            let sound = FightModel.ins().words[i].sound
            SoundManager.ins().playEffect(sound)
        }
        FightModel.ins().zombieDie(isDie)
        if (this.curZombieNum <= 0) {
            this.nestPlay()
        }
    }

    private addGuide(grp: egret.DisplayObjectContainer) {
        let skillStr = 'shoushi'
        let actions: string[] = [skillStr]
        if (skillStr.indexOf('_') > 0) {
            actions[0] = skillStr.split('_')[1]
            skillStr = skillStr.split('_')[0]
        }
        let mc = new DragonBonesManage()
        mc.register(DragonBonesFactory.ins().makeArmature("armature_" + skillStr, skillStr, 1), actions)
        if (mc.play(actions[0], 0)) {
            mc.armature.getClock().timeScale = 1
        }
        mc.x = 130
        mc.y = 200
        mc.touchEnabled = false
        grp.addChild(mc)
        this.guide = mc
    }
    private guide: DragonBonesManage
    private removeGuide() {
        if (this.guide) {
            this.guide.remove()
            DisplayUtils.removeFromParent(this.guide)
            this.guide = null
        }
    }

    public async showGuide() {
        let view = ViewManager.ins().getView(FightWin) as FightWin
        if (!view) {
            return
        }
        // let tip = FightData.getTipByRound(this.round)
        // if (tip) {
        //     wx.showToast({ title: tip, duration: 1500 })
        //     await TimerManager.ins().deleyPromisse(1700)
        // }
        this.addGuide(view)
        let tw = egret.Tween.get(this.guide)
        tw.wait(100).to({ x: 800, y: 400 }, 400).wait(100).call(() => {
            this.removeGuide()
        })
        await TimerManager.ins().deleyPromisse(600)
    }
}