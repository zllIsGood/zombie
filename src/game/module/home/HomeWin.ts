/* 主页
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 10:27:29 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-21 18:16:09
 */
class HomeWin extends BaseEuiView {

    // private bg: eui.Image
    testBtn: BaseBtn

    constructor() {
        super();
        this.skinName = `HomeSkin`;
    }

    public open(...param: any[]): void {
        this.addTouchEvent(this.testBtn, this.onClick);

        this.upView()
    }

    private upView() {

    }


    public close(...param: any[]): void {

    }


    private onClick(e: egret.TouchEvent): void {
        switch (e.currentTarget) {
            case this.testBtn:
                FightManager.ins().play(true)
                break;
        }
    }

}
ViewManager.ins().reg(HomeWin, LayerManager.UI_Main2);