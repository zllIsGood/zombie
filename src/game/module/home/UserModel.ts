/*
 * @Author: zhoulanglang 
 * @Date: 2020-09-24 11:13:39 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-22 15:30:36
 */
class UserModel extends BaseClass {

    public static ins(): UserModel {
        return super.ins();
    }

    public constructor() {
        super();
    }
    /**用户*/
    public token = 'token:624458313546997760'  //'token:624568812825616384'

    public async getUser() {
        return new Promise((resolve, reject) => {
            let obj = {
                url: encodeURI(Main.host + Api.USER_LIST),
                data: {
                    appToken: this.token
                },
                method: 'GET',
                success: (res) => {
                    console.log("request success!", res);
                    if (res.data.data) {
                        // this.setUserList(res.data.data)
                    }
                    resolve()
                },
                fail: (res) => {
                    console.log("request fail!", res);
                    resolve()
                }
            }
            wx.request(obj)
        })
    }


}
MessageCenter.compile(UserModel);