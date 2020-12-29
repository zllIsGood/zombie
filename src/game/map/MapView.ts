/**
 * 游戏地图
 * @author
 */
class MapView extends eui.Group {

	/**地图背景 */
	// private _mapImage: eui.Image 

	///////////////////////////////对象层////////////////////////////////////
	/**物品掉落对象层 */
	public dropLayer: egret.DisplayObjectContainer;
	/**实体对象层 */
	private entityLayer: egret.DisplayObjectContainer;
	private entityLayer1: egret.DisplayObjectContainer;
	private entityLayer2: egret.DisplayObjectContainer;
	//掉落物名字层
	// private _dropNameLayer: egret.DisplayObjectContainer;
	// /**技能表现层（最底层） */
	// private _effBottomLayer: egret.DisplayObjectContainer;
	/**技能表现层（最顶层） */
	// public effTopLayer: egret.DisplayObjectContainer;
	/**飘血视图层 */
	// public bloodLayer: egret.DisplayObjectContainer;

	public constructor() {
		super();

		this.touchEnabled = true;
		this.touchChildren = true;
		this.width = 1334
		this.height = 750
		this.verticalCenter = 0
		this.horizontalCenter = 0
	}

	public initMap(): void {

		this.dropLayer = new egret.DisplayObjectContainer;
		this.addChild(this.dropLayer);
		// this._effBottomLayer = new egret.DisplayObjectContainer;
		// this.addChild(this._effBottomLayer);
		this.entityLayer = new egret.DisplayObjectContainer;
		this.addChild(this.entityLayer);
		this.entityLayer1 = new egret.DisplayObjectContainer;
		this.addChild(this.entityLayer1);
		this.entityLayer2 = new egret.DisplayObjectContainer;
		this.addChild(this.entityLayer2);
		// this._dropNameLayer = new egret.DisplayObjectContainer;
		// this.addChild(this._dropNameLayer);

		// this.effTopLayer = new egret.DisplayObjectContainer;
		// this.addChild(this.effTopLayer);
		// this.bloodLayer = new egret.DisplayObjectContainer;
		// this.addChild(this.bloodLayer);

	}

	public addEntity(child, posy: number) {
		if (posy == 0) {
			this.entityLayer.addChild(child)
		}
		else if (posy == 1) {
			this.entityLayer1.addChild(child)
		}
		else if (posy == 2) {
			this.entityLayer2.addChild(child)
		}
	}

	public clearAllLayer(): void {
		// this._effBottomLayer.removeChildren();
		this.dropLayer.removeChildren();
		this.entityLayer.removeChildren();
		this.entityLayer1.removeChildren();
		this.entityLayer2.removeChildren();
		// this.effTopLayer.removeChildren();
		// this.bloodLayer.removeChildren();
	}

}
