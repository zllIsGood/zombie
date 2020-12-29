/* 怪物龙骨
 * @Author: gravitycat 
 * @Date: 2020-12-23 11:16:36 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 18:29:15
 */
class MonsterItem extends eui.Component {
    private _mc: DragonBonesManage
    public constructor() {
        super();
        //this.skinName = "MonsterItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeDG()
        this.callFun = null
    }

    private removeDG() {
        if (this._mc) {
            this._mc.removeCompleteCallFunc(this.backFun, this)
            this._mc.remove()
            DisplayUtils.removeFromParent(this._mc)
            this._mc = null
        }
    }

    /**
     * 举牌
     */
    public up() {
        let obj = this._mc.getCacheBone("tc")
        egret.Tween.get(obj.offset).to({
            rotation: -0.6
        }, 800)
    }

    /**
     * 落牌
     */
    public down() {
        let obj = this._mc.getCacheBone("tc")
        egret.Tween.get(obj.offset).to({
            rotation: 3
        }, 800)
    }

    public pause() {
        this._mc.stop()
    }

    public resume() {
        this._mc.start()
    }


    /**
     * 动画消失
     * @param  {number} type 
     */
    public dispose(type: string) {
        let _tween
        if (type == "huo") {
            _tween = egret.Tween.get(this).to({
                y: (this.y - 700),
                rotation: 180,
                scaleY: 0,
                scaleX: 0
            }, 500)
        }
        else {
            _tween = egret.Tween.get(this._mc).to({
                alpha: 0
            }, 2000)
        }
        _tween.call(() => {

            this.removeDG()
            DisplayUtils.removeFromParent(this) //僵尸消失
            let index = this.objData.isSuper ? this.objData.index2 : this.objData.index
            FightManager.ins().zombieDie(true, index)
        })
    }

    /**
     * 隐藏关节
     * @param  {string} bonename
     */
    public lostBone(bonename: string) {
        let bone = this._mc.getCacheBone(bonename)
        egret.Tween.get(bone.offset).to({
            rotation: 0.5
        }, 500).to({
            rotation: -0.5
        }, 500).call(() => {
            bone.visible = false
        }, this)
    }

    /**
     * 播放指定动画
     * @param  {} actionname
     */
    public play(actionname) {
        this._mc.play(actionname, 1)
    }

    /**
     * @param  {{type:number} obj 0-字符串  1-图片
     * @param  {string}} data
     */
    public replaceSlot(obj: { type: number, data: string }) {
        //下-x  左-y
        //let display = this._mc.armature.getArmature().getSlot("boardslot").display
        let display = this._mc.armature.getArmature().getSlot("mupai")

        if (!display) return
        let replceobj
        display.offset.x = 50
        if (obj.type == 1) {
            replceobj = new eui.Image(obj.data)
            replceobj.width = display.display.width * (this._ischange ? 1 : 0.6)
            replceobj.height = display.display.height * (this._ischange ? 1 : 0.5)
            display.offset.y = -20
            //replceobj.height = display.display.height
        }
        else {
            replceobj = new eui.Label(obj.data)
            replceobj.size = 70
            replceobj.verticalAlign = "middle"
            replceobj.textAlign = "center"
            replceobj.bold = true
            replceobj.height = display.display.height * (this._ischange ? 1 : 0.7)
        }
        display.offset.rotation = 0.2
        this._mc.armature.changeSlot("mupai", replceobj)
        if (!this._ischange) this._ischange = true
    }

    /*******++++++++++++++++++++++++++*/
    public objData: {
        name: string, actions?: string[], currentaction?: string,
        rate: number, sx: number, posy: number, tx: number, index: number, index2: number, isSuper: boolean,
        dx?, ms?, dy,
    }
    private _dx = { up: 15, hand: 30 }
    private dx(dgstr) {
        if (dgstr == 'newAnimation_diaoshou') {
            return this._dx.hand
        }
        return this._dx.up
    }
    private _duatime = { up: 1880, hand: 3750 }
    private duatime(dgstr) {
        if (dgstr == 'newAnimation_diaoshou') {
            return this._duatime.hand
        }
        return this._duatime.up
    }
    private superHp = 2
    private rate = 1 //速率
    private trapN = 0// 陷阱 0无  1true  2false
    private isDGUp = false //是抬脚还是收脚
    public _fallhead = false//是否掉手
    private hasPos: number[] = []
    private drop: string[] = null
    private _ischange = false//插槽对象是否已改变过
    public start() {
        this.rate = this.objData.rate
        this.trapN = 0
        this.hasPos = []
        this.superHp = 2
        this.drop = null
        this._fallhead = false
        this._dx = this.objData.dx ? this.objData.dx : this._dx
        this._duatime = this.objData.ms ? this.objData.ms : this._duatime

        let skeletonData = RES.getRes(this.objData.name + "_ske_json")
        let texturePng = RES.getRes(this.objData.name + "_tex_png")
        let textureData = RES.getRes(this.objData.name + "_tex_json")
        DragonBonesFactory.ins().initArmatureFile(skeletonData, texturePng, textureData);
        let mc = new DragonBonesManage()
        let armature = DragonBonesFactory.ins().makeArmature(this.objData.name, this.objData.name, 1)
        mc.register(armature, this.objData.actions)

        this.isDGUp = true
        let dgstr = this.isDGUp ? 'newAnimation_houbanduan' : 'newAnimation_qianbanduan'
        mc.play(dgstr, 1)
        mc.armature.getClock().timeScale = 1 * this.rate

        mc.addCompleteCallFunc(this.backFun, this)

        this._mc = mc
        this.addChildAt(mc, 0)
        mc.scaleX = mc.scaleY = 0.3

        this.x = this.objData.sx
        this.y = FightData.getZombieY(this.objData.posy) + this.objData.dy
        let tx = this.x - this.dx(dgstr)
        egret.Tween.get(this).to({ x: tx }, this.duatime(dgstr) / this.rate)

        this.changeWord(this.objData.index)
    }
    private backFun() {
        egret.Tween.removeTweens(this)
        if (this.drop && this.drop.length > 0) {
            this.playDrop()
            return
        }
        if (this.trapN == 1) {  //陷阱true  
            if (this.objData.isSuper) { //超级僵尸
                this.superHp--
                if (this.superHp <= 0) {
                    this.dispose(FightData.getTrapMc())
                }
                else {
                    this.changeWord(this.objData.index2)
                    this.drop = ['newAnimation_houbanduan', 'newAnimation_diaoshou', 'newAnimation_qianbanduan']
                    this.playDrop()
                }
            }
            else {
                this.dispose(FightData.getTrapMc())
            }
            //DisplayUtils.removeFromParent(this) //僵尸消失
            this.trapN = 0
            return
        }
        else if (this.trapN == 2) { //陷阱false
            this.trapN = 0
        }
        let pos = FightData.getGridPosX(this.x, this.objData.posy)
        let p: number
        if (pos) {
            p = pos.nx + pos.ny * 8
        }
        if (!this.isDGUp && pos && this.hasPos.indexOf(p) < 0) { //陷阱
            let num = 0
            if (this.callFun) {
                num = this.callFun(this)
            }
            // console.log('陷阱:', num)
            if (num == 0) {

            }
            else if (num == 1) { //陷阱true 
                this.trapN = 1
                this.hasPos.push(p)
                if (this.objData.isSuper && this.superHp > 1) {
                    if (this._fallhead) {
                        this._mc.getCacheBone("shou").visible = false
                        if (this._mc.getCacheBone("huaiubiao") != null) {
                            this._mc.getCacheBone("huaiubiao").visible = false
                        }
                    }
                    this._mc.play('newAnimation_zanting', 1)
                    this._mc.armature.getClock().timeScale = 1 * this.objData.rate
                }
                else {
                    this.dispose(FightData.getTrapMc())
                }
                let trap = new MovieClip()
                FightManager.ins().mapView.addEntity(trap, this.objData.posy)
                trap.playFile(FightData.getTrapMc(), 1)
                trap.scaleX = trap.scaleY = 3
                trap.x = this.x - 25
                trap.y = this.y - this.objData.dy + FightData.getTrapMcY() //80//60
                SoundManager.ins().playEffect(FightData.getTrapMusic())
                return
            }
            else if (num == 2) { //陷阱false
                this.trapN = 2
                this.hasPos.push(p)
                this._mc.play('newAnimation_zanting', 1)
                if (this._fallhead) {
                    this._mc.getCacheBone("shou").visible = false
                    if (this._mc.getCacheBone("huaiubiao") != null) {
                        this._mc.getCacheBone("huaiubiao").visible = false
                    }
                }
                this._mc.armature.getClock().timeScale = 1 * this.objData.rate
                this.rate += this.objData.rate
                SoundManager.ins().playEffect('err_effect_mp3')
                return
            }
        }
        if (this.x <= this.objData.tx) {
            DisplayUtils.removeFromParent(this)
            FightManager.ins().zombieDie(false, this.objData.index)
            return
        }
        this.playMove()
    }

    private playMove() {
        this.isDGUp = !this.isDGUp
        if (this._fallhead) {
            this._mc.getCacheBone("shou").visible = false
            if (this._mc.getCacheBone("huaiubiao") != null) {
                this._mc.getCacheBone("huaiubiao").visible = false
            }

        }
        let dgstr = this.isDGUp ? 'newAnimation_houbanduan' : 'newAnimation_qianbanduan'
        let tx = this.x - this.dx(dgstr)
        this._mc.play(dgstr, 1)
        this._mc.armature.getClock().timeScale = 1 * this.rate
        egret.Tween.get(this).to({ x: tx }, this.duatime(dgstr) / this.rate)
    }

    private playDrop() {
        let str = this.drop.shift()
        if (str) {
            if (this._fallhead) {
                this._mc.getCacheBone("shou").visible = false
                if (this._mc.getCacheBone("huaiubiao") != null) {
                    this._mc.getCacheBone("huaiubiao").visible = false
                }

            }
            let tx = this.x - this.dx(str)
            this._mc.play(str, 1)
            this._mc.armature.getClock().timeScale = 1 * this.rate
            egret.Tween.get(this).to({ x: tx }, this.duatime(str) / this.rate)
            if (str == 'newAnimation_diaoshou') {
                this._fallhead = true
            }
        }
        else {
            this.drop = null
            this.playMove()
        }
    }

    private changeWord(index: number) {
        let data = FightModel.ins().words[index]
        let type = FightManager.ins().round
        if (type == FightRound.ROUND2) {
            this.replaceSlot({ type: 0, data: data.word })
        }
        else if (type == FightRound.ROUND3) {
            this.replaceSlot({ type: 0, data: data.subWord.sub })
        }
        else if (type == FightRound.ROUND4) {
            this.replaceSlot({ type: 1, data: data.icon })
        }
        else {
            this.replaceSlot({ type: 1, data: data.icon })
        }
    }

    private callFun: Function
    public setCall(fun) {
        this.callFun = fun
    }
    /*******---------------------------*/

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
    }


}
