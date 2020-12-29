/*
 * @Author: zhoulanglang 
 * @Date: 2020-11-04 14:22:14 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 10:43:11
 */
/**开始战斗*/
function H5StartFight(data: string) {
    if (!H5Service.isReady) {
        console.log('还未就绪不能调用战斗！')
        return
    }
    console.log('开始战斗:', data)
    data = StringUtils.deleteChangeLine(data)
    // data.replace('\\', '\\\\')
    // console.log(data)
    let obj = JSON.parse(data)
    FightManager.ins().initWords(obj)
    // TimerManager.ins().doTimer(4000, 1, () => {
    //     H5Service.H5Result(true, 3)
    // }, null)
}

class H5Service {
    public static isReady = false
    /**已就绪*/
    public static H5Ready() {
        if (window['AndroidJs'] && AndroidJs.H5Ready) {
            console.log('已就绪')
            this.isReady = true
            AndroidJs.H5Ready()
        }
    }
    /**战斗结果*/
    public static H5Result(isWin: boolean, flower: number) {
        if (window['AndroidJs'] && AndroidJs.H5Result) {
            console.log('战斗结果', isWin)
            let str = JSON.stringify({ isWin: isWin, flower: flower })
            AndroidJs.H5Result(str)
        }
    }
}