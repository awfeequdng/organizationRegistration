const app = getApp()

Page({
    data: {
        cover: false,
        overflow: 'visible',
        modifyCover: false,
        modify: false,
        delete: false,
        change: false,
        disabled: false,
        // src: {
        //     src_1: "../../img/icon1.png",
        //     src_2: "../../img/icon2.png",
        //     src_3: "../../img/icon3_on.png"
        // },
        nickame: '',
        avatarUrl: '',
        stuname: '',
        stuid: '',
        phonenum: '',
        moreClassName1: 'more',
        more1: '../../img/more.png',
        moreClassName2: 'pick',
        more2: '../../img/pick.png',
        orgnazition: [],
        newPersonal: {
            idnum: '',
            stuid: '',
            phonenum: ''
        },
        deleteName: {},
        modifyName: {},
        orz: [{
            name: "红岩网校工作站",
            statement: ['产品策划及运营部', '视觉设计部', 'Web研发部', '移动开发部', '运维安全部']
        }, {
            name: "校团委宣传部",
            statement: ['校团委宣传部']
        }, {
            name: "校团委组织部",
            statement: ['校团委组织部']
        }, {
            name: "校团委办公室",
            statement: ['校团委办公室']
        }, {
            name: "校学生会",
            statement: ['综合部', '学习部', '宣传部', '权益提案部', '生活服务部', '文艺部', '体育部', '女生部']
        }, {
            name: "学生科技联合会",
            statement: ['综合部', '科技人文部', '项目管理部', '媒体运营部', '科创竞赛部', '信息部']
        }, {
            name: "青年志愿者协会",
            statement: ['综合管理部', '青年志愿者服务总队', '实践服务部', '宣传推广部']
        }, {
            name: "大学生艺术团",
            statement: ['管乐团', '民乐团', '舞蹈团', '合唱团', '话剧团', '综合部']
        }, {
            name: "学生社团联合会",
            statement: ['综合部', '宣传部', '社团服务部', '社团活动部']
        }, {
            name: "勤工助学中心",
            statement: ['行政部', '宣传部', '策划部', '对外联络部', '失物招领部', '学生超市', '绿色书屋', '学生打印社', '文化产品部']
        }, {
            name: "重邮就业中心",
            statement: ['综合支撑组', '对外活动组', '媒体运营组']
        }],
        thisOrz: {}
    },
    dealData: function(arr) { //数据处理
        let data = [];
        if (arr.length === 0) {
            return data;
        }
        arr.forEach((item) => {
            let oname = item.oname;
            let l = data.length;
            if (item.info.length === 0) {
                item.info[0] = {
                    info: "暂无消息通知，请耐心等待，时时留意"
                }
            } else {
                for (var i = 0; i < item.info.length; i++) {

                    item.info[i] = { ...item.info[i],
                        time: item.info[i].time.slice(0, 19)
                    }
                }
            }

            if (l === 0) {
                data.push({
                    oname: item.oname,
                    show: false,
                    statement: [{
                        id: item.id,
                        index: l,
                        dname: item.dname,
                        show: false,
                        news: item.info,
                        see: item.see
                    }]

                })
                return;
            }

            for (var i = 0; i < data.length; i++) {
                if (data[i].oname === oname) {
                    data[i].statement.push({
                        id: item.id,
                        index: i,
                        dname: item.dname,
                        show: false,
                        news: item.info,
                        see: item.see
                    })
                    break;
                }
                if (data[i].oname !== oname && i === data.length - 1) {
                    data.push({
                        oname: item.oname,
                        show: false,
                        statement: [{
                            id: item.id,
                            index: l,
                            dname: item.dname,
                            show: false,
                            news: item.info,
                            see: item.see
                        }]

                    })
                    break;
                }
            }
        })

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].statement.length; j++) {
                if (data[i].statement[j].see == 0) {
                    data[i].see = 0;
                }
            }
        }
        console.log(data);
        return data;
    },
    onLoad: function(e) {
        this.getOrz();
    },
    onReady: function(e) {

        let nickName = wx.getStorageSync('nickName')
        this.setData({
            nickName: wx.getStorageSync('nickName'),
            avatarUrl: wx.getStorageSync('avatarUrl'),
            stuid: wx.getStorageSync('stuid'),
            phonenum: wx.getStorageSync('phonenum'),
        })
    },
    onShow: function(e) {
        this.getOrz();
        app.getNewNews();
    },
    getOrz: function(e) {
        let that = this;
        wx.request({
            // 必需
            url: 'https://bmtest.redrock.team/msg/cinfo',
            data: {
                openid: wx.getStorageSync('openid')
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: wx.getStorageSync('Authorization')
            },
            method: 'POST',
            success: (res) => {
                console.log(res.data);

                that.setData({
                    orgnazition: that.dealData(res.data)
                })
            },
            fail: (res) => {

            },
            complete: (res) => {

            }
        })
    },
    showStatement: function(e) {
        //console.log(e.currentTarget.dataset.name, e.currentTarget.dataset.index);
        let index = parseInt(e.currentTarget.dataset.index, 10);
        let arr = this.data.orgnazition;
        //console.log(arr[index].show);
        if (arr[index].show) {
            arr[index].show = false;
            for (let value of arr[index].statement) {
                //console.log(value)
                value.show = false;
            }
        } else {
            arr[index].show = true;
        }

        this.setData({
            orgnazition: arr
        });
    },
    showNews: function(e) {
        //if (e.) {}
        console.log(e.currentTarget.dataset);

        let index = parseInt(e.currentTarget.dataset.index, 10);
        let orIndex = parseInt(e.currentTarget.dataset.orindex, 10);
        let arr = this.data.orgnazition;

        if (arr[orIndex].statement[index].show) {
            arr[orIndex].statement[index].show = false;
        } else {
            arr[orIndex].statement[index].show = true;
            if (arr[orIndex].statement[index].see == 0) {
                console.log(e.currentTarget.dataset.cid);
                this.hasSaw(e.currentTarget.dataset.cid);
                arr[orIndex].statement[index].see = 1;
                arr[orIndex].see = 1;
                for (var i = 0; i < arr[orIndex].statement.length; i++) {
                    console.log()
                    if (arr[orIndex].statement[i].see == 0) {
                        arr[orIndex].see = 0;
                    }
                }

            }
        }

        this.setData({
            orgnazition: arr
        });
        //this.getOrz();
    },
    hasSaw: function(cid) {
        wx.request({
            // 必需
            url: 'https://bmtest.redrock.team/msg/usersee',
            data: {
                openid: wx.getStorageSync('openid'),
                cid: cid
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: wx.getStorageSync('Authorization')
            },
            method: 'POST',
            success: (res) => {
                console.log(res);
                app.getNewNews();
            },
            fail: (res) => {

            },
            complete: (res) => {

            }
        })
    },
    gotoModify: function(e) {
        this.setData({
            modify: true
        })
    },
    quitChange: function(e) {
        console.log(e)
        this.setData({
            modify: false
        })
    },
    modifyPersonal: function(e) {
        wx.hideTabBar();
        this.setData({
            cover: true,
            overflow: 'hidden',
            stuid: wx.getStorageSync('stuid'),
            phonenum: wx.getStorageSync('phonenum'),
            //stuname: wx.getStorageSync('stuname'),
            newPersonal: {
                idnum: '',
                stuid: '',
                phonenum: ''
            }
        })
    },
    quitModifyP: function(e) {
        wx.showTabBar();
        this.setData({
            cover: false,
            overflow: 'visible'
        })
    },
    getInput: function(e) {
        switch (e.target.id) {
            case "idnum":
                this.setData({
                    newPersonal: {
                        ...this.data.newPersonal,
                        idnum: e.detail.value
                    }
                })
                break;
            case "stuid":
                this.setData({
                    newPersonal: {
                        ...this.data.newPersonal,
                        stuid: e.detail.value
                    }
                })
                break;
            case "phonenum":
                this.setData({
                    newPersonal: {
                        ...this.data.newPersonal,
                        phonenum: e.detail.value
                    }
                })
                break;
            default:
                console.log(false);
                break;
        }
        console.log(this.data.newPersonal)
    },
    move: function(e) {
        //避免微信垃圾控件因滑动过快不能及时获取到值
        this.setData({
            disabled: true
        })
        let that = this;
        setTimeout(function(e) {
            that.setData({
                disabled: false
            })
        }, 1000)
    },
    checkModifyPersonal: function(e) {
        let that = this;
        let newPersonal = this.data.newPersonal
        let title = '修改失败';
        if (!app.checkInput(newPersonal, title)) {
            return;
        }
        wx.request({

            url: 'https://bmtest.redrock.team/user/updateuser',
            data: {
                ...newPersonal,
                openid: wx.getStorageSync('openid')
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: wx.getStorageSync('Authorization')
            },
            method: 'POST',
            success: (res) => {
                console.log(res);
                if (res.data == 'success') {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1200,
                        mask: true
                    })
                    that.setData({
                        //stuname: newPersonal.stuname,
                        stuid: newPersonal.stuid,
                        phonenum: newPersonal.phonenum
                    })
                    wx.setStorage({
                        key: "stuid",
                        data: newPersonal.stuid
                    })
                    wx.setStorage({
                        key: "phonenum",
                        data: newPersonal.phonenum
                    })

                    // wx.setStorage({
                    //     key: 'stuname',
                    //     data: newPersonal.stuname
                    // })
                    wx.showTabBar();
                } else {
                    wx.showModal({
                        title: '修改失败',
                        content: '请重试',
                        showCancel: false
                    })
                    wx.showTabBar();
                }
            },
            fail: (res) => {
                wx.showModal({
                    title: '修改失败',
                    content: '请重试',
                    showCancel: false
                })
                wx.showTabBar();
            },
            complete: (res) => {
                that.setData({
                    cover: false,
                    overflow: 'visible'
                });
                wx.showTabBar();
            }
        })
    },
    deleteStatement: function(e) {
        let oname = this.data.orgnazition[e.currentTarget.dataset.orindex].oname;
        let dname = this.data.orgnazition[e.currentTarget.dataset.orindex].statement[e.currentTarget.dataset.index].dname
        this.setData({
            overflow: 'hidden',
            modifyCover: true,
            delete: true,
            deleteName: {
                openid: wx.getStorageSync('openid'),
                oname: oname,
                dname: dname
            }
        })
        wx.hideTabBar();
    },
    checkDelete: function(e) {
        let deleteName = this.data.deleteName;
        wx.request({
            // 必需
            url: 'https://bmtest.redrock.team/msg/dechoose',
            data: {
                ...deleteName,
                openid: wx.getStorageSync('openid')
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: wx.getStorageSync('Authorization')
            },
            method: 'POST',
            success: (res) => {
                console.log(res)
                this.getOrz();
            },
            fail: (res) => {
                console.log(res)
            },
            complete: (res) => {
                wx.showTabBar();
            }
        })
        this.setData({
            modifyCover: false,
            overflow: 'visible',
            delete: false,
            deleteName: {}
        })
    },
    quitDelete: function(e) {
        this.setData({
            modifyCover: false,
            overflow: 'visible',
            delete: false,
            deleteName: {}
        })
        wx.showTabBar()
    },
    modifyStatement: function(e) {
        let oldOname = this.data.orgnazition[e.currentTarget.dataset.orindex].oname;
        let oldDname = this.data.orgnazition[e.currentTarget.dataset.orindex].statement[e.currentTarget.dataset.index].dname;
        this.setData({
            overflow: 'hidden',
            modifyCover: true,
            delete: false
        })

        let thisOrz = {};
        this.data.orz.forEach(function(e) {
            if (e.name === oldOname) {
                thisOrz = e;
                return;
            }
        })
        this.setData({
            thisOrz: thisOrz,
            modifyName: {
                length: thisOrz.statement.length,
                oldoname: oldOname,
                olddname: oldDname,
                newoname: oldOname,
                newdname: thisOrz.statement[0]
            }
        })
        wx.hideTabBar();
    },
    quitModify: function(e) {
        this.setData({
            thisOrz: {},
            modifyCover: false,
            overflow: 'visible',
            delete: false,
            modifyName: {}
        })
        wx.showTabBar();
    },
    getPicker: function(e) {
        this.setData({
            modifyName: {
                ...this.data.modifyName,
                //index: e.detail.value[0],
                newdname: this.data.thisOrz.statement[e.detail.value[0]]
            }
        })
        console.log(this.data.modifyName)
    },
    checkChange: function(e) {
        let modifyName = this.data.modifyName;
        if (modifyName.olddname === modifyName.newdname) {
            wx.showModal({
                title: '修改后部门与原部门相同',
                content: '请重试',
                showCancel: false
            })
            return
        }
        wx.request({
            // 必需
            url: 'https://bmtest.redrock.team/msg/rechoose',
            data: {
                ...modifyName,
                openid: wx.getStorageSync('openid')
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: wx.getStorageSync('Authorization')
            },
            method: 'POST',
            success: (res) => {
                if (res.data == 200) {
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success',
                        duration: 1200,
                        mask: true
                    })
                    this.getOrz();
                    this.setData({
                        thisOrz: {},
                        modifyCover: false,
                        overflow: 'visible',
                        delete: false,
                        modifyName: {}
                    })
                    wx.showTabBar();
                } else {
                    wx.showModal({
                        title: '修改失败',
                        content: '请重试',
                        showCancel: false
                    })
                }
            },
            fail: (res) => {
                wx.showModal({
                    title: '修改失败',
                    content: '请重试',
                    showCancel: false
                })
            },
            complete: (res) => {

            }
        })
    }
})