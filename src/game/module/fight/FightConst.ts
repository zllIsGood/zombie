/*
 * @Author: zhoulanglang 
 * @Date: 2020-12-23 17:47:44 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-23 17:50:59
 */
/**场景图类型*/
const enum SceneType {
    TYPE1 = 1,
    TYPE2 = 2,
}
/**轮数*/
const enum FightRound {
    ROUND1 = 1, //图片找单词
    ROUND2 = 2, //单词找汉语
    ROUND3 = 3, //单词+汉语  找单词缺少部分
    ROUND4 = 4, //图片找发音
}
type WordType = {
    word: string
    means: string
    icon: string
    sound: string
    subWord?: { subWord: string, sub: string }
}