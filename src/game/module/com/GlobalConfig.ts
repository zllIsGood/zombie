/*
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 11:27:54 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-07 18:39:11
 */
class GlobalConfig {

    public static init(data) {
        // console.log(data)
        this.config = data
    }

    public static initDG(data) {
        // console.log(data)
        this.dgcf = data
    }


    public static config



    public static dgcf
    public static helpImgUrl = '' // './resource/assets/other/help_cover.png'
}
window["GlobalConfig"] = GlobalConfig