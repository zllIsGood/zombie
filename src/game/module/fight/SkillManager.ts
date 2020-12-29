/*
 * @Author: zhoulanglang 
 * @Date: 2020-09-10 15:55:12 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-22 15:33:50
 */
class SkillManager extends BaseClass {
    public static ins(): SkillManager {
        return super.ins();
    }

    public constructor() {
        super();
    }

    public initDgFactory() {
        var dgList = GlobalConfig.dgcf.dg;
        for (let i of dgList) {
            var dbName: string = i.armature.split('_')[1]
            var skeletonData: any
            var texturePng: egret.Texture
            var textureData: any
            skeletonData = RES.getRes(dbName + "_ske_json")
            texturePng = RES.getRes(dbName + "_tex_png")
            textureData = RES.getRes(dbName + "_tex_json")
            if (skeletonData && texturePng && textureData) {
                this.initArmature(skeletonData, texturePng, textureData, dbName, i.action)
            }
        }
    }

    private initArmature(skeletonData, texturePng, textureData, name: string, action) {
        if (undefined != skeletonData && undefined != texturePng && undefined != textureData) {
            DragonBonesFactory.ins().initArmatureFile(skeletonData, texturePng, textureData);
            // let dbe = new DragonBonesManage();
            // this.effectArmature[name] = dbe
            // dbe.register(DragonBonesFactory.ins().makeArmature("armature_" + name, name, 1), action)
        }
    }

}