/*
 * @Author: zhoulanglang 
 * @Date: 2020-12-23 12:10:57 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 11:20:50
 */
class WordItem extends eui.ItemRenderer {

    private lab: eui.Label
    private img: eui.Image
    private selectImg: eui.Image
    private bgImg: eui.Image
    data: { type: FightRound, word: WordType, index: number }
    public constructor() {
        super();
        this.skinName = "WordItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.anchorOffsetX = this.width / 2
        this.anchorOffsetY = this.height / 2
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this)
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this)
        this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this)
    }

    protected dataChanged() {
        let data = this.data
        if (!data) {
            return
        }
        if (data.type == FightRound.ROUND1) {
            this.lab.text = data.word.word
        }
        else if (data.type == FightRound.ROUND2) {
            this.lab.text = data.word.means
        }
        else if (data.type == FightRound.ROUND3) {
            this.lab.text = data.word.subWord.subWord
        }
        else if (data.type == FightRound.ROUND4) {
            this.img.source = 'horn_play_png'
        }
    }

    private removeTw() {
        this.bgImg.rotation = 0
        egret.Tween.removeTweens(this.bgImg)
        this.bgImg.source = 'boder_kapian_png'
    }


    private addTw() {
        egret.Tween.removeTweens(this.bgImg)
        this.bgImg.rotation = 0
        let tw = egret.Tween.get(this.bgImg)
        tw.to({ rotation: 360 }, 1500).call(this.addTw, this)
    }

    private isRun = false //是否旋转
    private changeState() {
        if (this.x > this.width * 1.1) {
            if (!this.isRun) {
                this.isRun = true
                this.addTw()
                this.bgImg.source = 'yqx_img_png'
                this.hideSelect()
            }
        }
    }
    /**重置*/
    private ret() {
        if (this.isRun) {
            this.removeTw()
            this.bgImg.source = 'boder_kapian_png'
        }
        this.hideSelect()
        if (this.isRun) {
            this.x = 0 + this.width / 2
            this.y = this.data.index * 137 + this.height / 2
            this.scaleX = this.scaleY = 0.1
            let tw = egret.Tween.get(this)
            tw.to({ scaleX: 1, scaleY: 1 }, 200)
        }
        else {
            let x = 0 + this.width / 2
            let y = this.data.index * 137 + this.height / 2
            let tw = egret.Tween.get(this)
            tw.to({ x: x, y: y }, 100)
            this.scaleX = this.scaleY = 1
        }
        this.isRun = false
    }

    public showSelect() {
        if (!this.isRun) {
            this.selectImg.visible = true
        }
    }
    public hideSelect() {
        this.selectImg.visible = false
    }

    private playSound() {
        let data = this.data
        if (!data) {
            return
        }
        if (data.type == FightRound.ROUND4) {
            SoundManager.ins().playEffect(data.word.sound)
        }
    }

    private _touchStatus = false
    private touchXY: { x, y }
    private mouseDown(evt: egret.TouchEvent) {
        this.playSound()
        this.showSelect()
        // console.log("Mouse Down.")
        this._touchStatus = true
        this.touchXY = { x: evt.stageX, y: evt.stageY }
        // this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this)
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this)
        let parent = this.parent
        if (parent) {
            parent.addChildAt(this, parent.numChildren)
        }
    }

    private mouseMove(evt: egret.TouchEvent) {
        if (this._touchStatus) {
            // console.log("moving now ! Mouse: [X:" + evt.stageX + ",Y:" + evt.stageY + "]")
            this.changeState()
            this.x += evt.stageX - this.touchXY.x
            this.y += evt.stageY - this.touchXY.y
            this.touchXY = { x: evt.stageX, y: evt.stageY }
        }
    }

    private mouseUp(evt: egret.TouchEvent) {
        if (!this._touchStatus) {
            return
        }
        this.hideSelect()
        // console.log("Mouse Up.")
        this._touchStatus = false;
        this.touchXY = null
        // this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this)
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this)
        let point = { x: this.x, y: this.y }
        this.ret()
        if (this.callFun) {
            this.callFun({ data: this.data, point: point })
        }
    }

    private callFun: Function
    public setCallBack(callFun: Function) {
        this.callFun = callFun
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this)
        this.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this)
        this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this)
        this.callFun = null
        this.removeTw()
        this.isRun = false
    }

}