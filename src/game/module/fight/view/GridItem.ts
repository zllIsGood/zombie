/*
 * @Author: zhoulanglang 
 * @Date: 2020-12-22 11:13:43 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 11:22:00
 */
class GridItem extends eui.ItemRenderer {

    private lab: eui.Label
    private img: eui.Image
    private quan: eui.Image
    data: { type: FightRound, word: WordType, index: number }
    public constructor() {
        super();
        this.skinName = "GridItemSkin";
        this.addEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this);
        this.addEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        this.anchorOffsetX = 60
        this.anchorOffsetY = 60
    }

    public childrenCreated(): void {
        super.childrenCreated();
    }

    public open(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.ADDED_TO_STAGE, this.open, this)
        this.addTw()
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

    private addTw() {
        egret.Tween.removeTweens(this.quan)
        this.quan.rotation = 0
        let tw = egret.Tween.get(this.quan)
        tw.to({ rotation: 360 }, 1500).call(this.addTw, this)
    }

    public close(...param: any[]): void {
        this.removeEventListener(egret.TouchEvent.REMOVED_FROM_STAGE, this.close, this);
        egret.Tween.removeTweens(this.quan)
    }

}