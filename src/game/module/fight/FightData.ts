/*
 * @Author: zhoulanglang 
 * @Date: 2020-12-23 15:18:22 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-23 16:50:51
 */
class FightData {
    private static _grid = [
        { x: 200, y: 230, w: 1064, h: 435, dw: 133, dh: 145 },
        { x: 238, y: 185, w: 968, h: 405, dw: 121, dh: 135 },
    ]
    public static get grid() {
        let type = FightManager.ins().sceneType
        return this._grid[type - 1]
    }

    /**格子数*/
    public static getGridPosX(x: number, ny: number) {
        let grid = this.grid
        if (x >= grid.x && x < grid.x + grid.w) {
            let nx = Math.floor((x - grid.x) / grid.dw)
            return { nx: nx, ny: ny }
        }
        return null
    }
    /**格子数*/
    public static getGridPos(x: number, y: number) {
        let grid = this.grid
        if (x >= grid.x && x < grid.x + grid.w && y >= grid.y && y < grid.y + grid.h) {
            let nx = Math.floor((x - grid.x) / grid.dw)
            let ny = Math.floor((y - grid.y) / grid.dh)
            return { nx: nx, ny: ny }
        }
        return null
    }
    /**格子中心坐标*/
    public static getGridXY(nx: number, ny: number) {
        let grid = this.grid
        let pos = { x: grid.x + grid.dw * (nx + 0.5), y: grid.y + grid.dh * (ny + 0.5) }
        return pos
    }
    /**获取僵尸坐标y*/
    public static getZombieY(posy: number) {
        let type = FightManager.ins().sceneType
        if (type == SceneType.TYPE1) {
            return 145 * posy + 220
        }
        else if (type == SceneType.TYPE2) {
            return 135 * posy + 170
        }
    }

    private static mcName = ["huo", "bingdongixaoguo"]
    /**获取陷阱*/
    public static getTrapMc(): string {
        let ret = this.mcName[FightManager.ins().sceneType - 1]
        return ret
    }
    /**获取陷阱dy*/
    public static getTrapMcY(): number {
        let arr = [80, 60]
        let ret = arr[FightManager.ins().sceneType - 1]
        return ret
    }
    /**获取陷阱音乐*/
    public static getTrapMusic(): string {
        let arr = ['fire_effect_mp3', 'ice_effect_mp3']
        let ret = arr[FightManager.ins().sceneType - 1]
        return ret
    }

    /**获取背景音乐*/
    public static getBgMusic(): string {
        let arr = ['fire_bg_mp3', 'ice_bg_mp3']
        let ret = arr[FightManager.ins().sceneType - 1]
        return ret
    }

    public static zombieData = [
        { skeName: 'shaungbaotai', isSuper: false, dx: { up: 25, hand: 0 }, ms: { up: 1880, hand: 0 }, rate: 3, dy: 0 },
        { skeName: 'fengmaozi', isSuper: true, dx: { up: 25, hand: 50 }, ms: { up: 1880, hand: 3750 }, rate: 3, dy: 0 },
        { skeName: 'tuzidonghaua', isSuper: true, dx: { up: 15, hand: 30 }, ms: { up: 1880, hand: 3750 }, rate: 5, dy: 0 },
        { skeName: 'btuzidonghaua', isSuper: false, dx: { up: 15, hand: 0 }, ms: { up: 1880, hand: 0 }, rate: 5, dy: 0 },
        { skeName: 'shuangbaotaidh', isSuper: false, dx: { up: 25, hand: 50 }, ms: { up: 1880, hand: 0 }, rate: 3, dy: 0 },
        { skeName: 'honghuanghou', isSuper: true, dx: { up: 16.7, hand: 33.4 }, ms: { up: 1250, hand: 2500 }, rate: 3, dy: 50 }
    ]
}