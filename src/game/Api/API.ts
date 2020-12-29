/* 接口
 * @Author: zhoualnglang 
 * @Date: 2020-03-31 19:25:45 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-22 15:49:19
 */
class Api {
    /*广告配置*/
    public static AD_CONFIG = "/user/ad/getAdConfig";
    // public static AD_OPEN = "/user/version/getVersion";
    //反馈
    public static SAVE_BACK = "/user/feedback/save";

    // 用户
    public static USER_LOGIN = "/word/user/login";
    public static USER_WATCH_AD = "/word/user/watchAd";
    public static USER_SHARE_VIDEO = "/word/user/shareVideo";
    public static USER_SHARE_PROGRAM = "/word/user/shareProgram";
    public static USER_LOGIN_AWARD = "/word/user/loginAward";
    //h5积分换体力
    public static EXCHANGE_ENERGY = "/word/user/exchangeEnergy";


    //卡牌
    public static USER_LIST = "/card/card/listUserCard"; //获取卡牌列表
}