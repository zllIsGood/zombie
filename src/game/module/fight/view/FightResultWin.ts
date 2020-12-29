/* 结果
 * @Author: zhoulanglang 
 * @Date: 2020-12-26 10:35:09 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 11:21:39
 */
class FightResultWin extends BaseEuiView {

    private flower1: eui.Image
    private flower2: eui.Image
    private flower3: eui.Image
    private closeBtn: BaseBtn
    private retBtn: BaseBtn
    private grp: eui.Group
    private mc: DragonBonesManage

    private isWin: boolean
    private flowers: number

    constructor() {
        super();
        this.skinName = `FightResultSkin`;
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.closeBtn, this.onClick);
        this.addTouchEvent(this.retBtn, this.onClick);

        this.isWin = param[0]
        this.flowers = param[1]
        this.upView()
    }

    private upView() {
        this.addDG(this.isWin ? 'shengli' : 'shibai')
        let flowers = this.flowers
        for (let i = 1; i <= FightModel.ins().maxFlower; i++) {
            let obj = this['flower' + i] as eui.Image
            if (this.isWin && flowers >= i) {
                obj.visible = true
            }
            else {
                obj.visible = false
            }
        }
    }

    private addDG(skillStr: string) {
        this.removeDG()
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
        mc.x = 667
        mc.y = 375
        this.grp.addChildAt(mc, 0)
        this.mc = mc
    }
    private removeDG() {
        if (this.mc) {
            this.mc.remove()
            DisplayUtils.removeFromParent(this.mc)
            this.mc = null
        }
    }

    public close(...param: any[]): void {
        this.removeDG()
    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.retBtn:
                ViewManager.ins().close(this)
                FightManager.ins().replay()
                break;
            case this.closeBtn:
                FightManager.ins().result()
                break;
        }
    }

}
ViewManager.ins().reg(FightResultWin, LayerManager.UI_Popup);