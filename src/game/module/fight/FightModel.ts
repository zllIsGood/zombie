/*
 * @Author: zhoulanglang 
 * @Date: 2020-10-19 11:37:56 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-12-26 11:04:49
 */
class FightModel extends BaseClass {

    public static ins(): FightModel {
        return super.ins();
    }

    public constructor() {
        super();
    }

    private wordList = [
        {
            "id": 1,
            "word": "father",
            "image": "http://cdndev.zmfamily.cn/word/l3/father.jpg",
            "translate": "父亲",
            "ukPhonetic": "'fɑːðə",
            "ukSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581393793094397952.mp3",
            "usPhonetic": "'fɑðɚ",
            "usSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581393793526411264.mp3"
        },
        {
            "id": 2,
            "word": "mother",
            "image": "http://cdndev.zmfamily.cn/word/l3/mother.png",
            "translate": "母亲",
            "ukPhonetic": "'mʌðə",
            "ukSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581405379070668800.mp3",
            "usPhonetic": "'mʌðɚ",
            "usSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581405379402018816.mp3"
        },
        {
            "id": 3,
            "word": "brother",
            "image": "http://cdndev.zmfamily.cn/word/l3/brother.png",
            "translate": "兄弟",
            "ukPhonetic": "''brʌðə",
            "ukSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581383466323685376.mp3",
            "usPhonetic": "ˈbrʌðər",
            "usSpeech": "https://cdndev.zmfamily.cn/source/2020-05-23/581383466655035392.mp3"
        }
    ]

    public initWords(list) {
        this.words = []
        for (let item of list) {
            let word = { word: item.word, means: item.translate, icon: item.image, sound: item.usSpeech }
            this.words.push(word)
        }
    }

    public words: WordType[] = [
        // { word: 'Christmas tree', means: '苹果', icon: 'horn_play_png', sound: 'fight_win_mp3' },
        // { word: 'blue', means: '蓝色', icon: 'flower_png', sound: 'fight_win_mp3' },
        // { word: 'yellow', means: '黄色', icon: 'touxaing_png', sound: 'fight_win_mp3' },
        // { word: 'red', means: '红色', icon: 'icon_hongxing_png', sound: 'fight_win_mp3' },
        { word: 'father', means: '父亲', icon: 'http://cdndev.zmfamily.cn/word/l3/father.jpg', sound: 'https://cdndev.zmfamily.cn/source/2020-05-23/581393793526411264.mp3' },
        { word: 'mother', means: '母亲', icon: 'http://cdndev.zmfamily.cn/word/l3/mother.png', sound: 'https://cdndev.zmfamily.cn/source/2020-05-23/581405379402018816.mp3' },
        { word: 'brother', means: '兄弟', icon: 'http://cdndev.zmfamily.cn/word/l3/brother.png', sound: 'https://cdndev.zmfamily.cn/source/2020-05-23/581383466655035392.mp3' },
    ]

    public checkWord() {
        this.subWords = []
        for (let word of this.words) {
            word.subWord = this.subWord(word.word)
            if (word.word.indexOf(' ') >= 0) {
                word.word = word.word.replace(/ /g, '\n')
            }
        }
        this.subWords = []
    }

    private subWords: string[] = []
    private subWord(str: string) {
        let i = str.lastIndexOf(' ')
        if (i >= 0) {
            let adds = '\n__'
            let subWord = str.substring(i + 1)
            this.subWords.push(subWord)
            return { sub: str.substring(0, i) + adds, subWord: subWord }
        }
        if (str.length > 3) {
            let pos = str.length - 2
            let subWord = str.substring(str.length - 2)
            for (let k = str.length - 2; k >= 1; k--) {
                let sub2 = str.substring(k, k + 2)
                if (this.subWords.indexOf(sub2) < 0) {
                    subWord = sub2
                    this.subWords.push(sub2)
                    pos = k
                    break
                }
            }
            return { sub: str.substring(0, pos) + '__' + str.substring(pos + 2, str.length), subWord: subWord }
        }
        let subWord = str.substring(str.length - 1)
        this.subWords.push(subWord)
        return { sub: str.substring(0, str.length - 1) + '_', subWord: subWord }
    }

    /**死亡或消除一只僵尸*/
    public zombieDie(isDie = false) {
        if (isDie) {
            this.zombieBar = this._zombieBar + 1
        }
        else {
            this.hp--
        }
    }

    /**最大生命值*/
    public maxHp = 5
    /**生命值*/
    private _hp = 5
    public get hp() {
        return this._hp
    }
    public set hp(v: number) {
        this._hp = v
        this.postHp()
    }

    /**最大花数*/
    public maxFlower = 3
    private _flower = 0
    public get flower() {
        return this._flower
    }
    public set flower(v: number) {
        this._flower = v
        this.postFlower()
    }
    /**消灭僵尸进度*/
    private _zombieBar = 0
    public get zombieBar() {
        return this._zombieBar / (this.words.length * 4)
    }
    public set zombieBar(v) {
        this._zombieBar = v
        this.flower = this.zombieBar * 3 >> 0
    }

    public clearData() {
        this.zombieBar = 0
        this.flower = 0
        this.hp = this.maxHp
    }

    public postRound() { }
    public postMonster() { }
    public postHp() { }
    public postFlower() { }
}
MessageCenter.compile(FightModel);