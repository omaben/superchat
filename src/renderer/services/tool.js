import Bus from "@/services/bus";
import $ from "jquery";
import cryptos from '@/services/utils';
import MSG_TYPE from "@/services/im/constant";
import fData from "@/app.config";
import { imGetOfflineMsg, getUserSessionList } from '@/services'
//过滤器
import filters, { getNowTime, nextWeek } from "./filter";
// 常量 rootConfig 国际化处理
import rootConfigs from './rootConfig';
import rootConfigEN from './rootConfigEN';
import rootConfigTC from "./rootConfigTC";

const local = sessionStorage.getItem("local") ?
    sessionStorage.getItem("local") :
    "zh";

let key = "";
let rootConfig = []
switch (local) {
    case "zh_TC":
        key = "tc";
        break;
    default:
        key = local;
        break;
}
switch (key) {
    case "zh":
        rootConfig = rootConfigs;
        break;
    case "en":
        rootConfig = rootConfigEN;
        break;
    case "tc":
        rootConfig = rootConfigTC;
        break;
    default:
        rootConfig = rootConfigs;
        break;
}

//去掉第0个为{auto:false}
for (let key in rootConfig) {
    if (rootConfig[key][0].auto === false) {
        rootConfig[key].splice(0, 1);
    }
}

//图片预览
import gallery from 'img-vuer'
import {
    userStore,
    setUserStore,
    getUserStore,
    getChatLocalMsgStore,
    setChatLocalMsgStore,
    hasChatLocalMsgStore,
} from "tool/storage";
// 用户详情 房间详情
import {
    queryUserByid,
    queryRoomsByIds,
    findUsersByRoomId
} from "@/services";
// Dexie.js
// 挂载到vue的原型链，可以全局使用 this.[chatInRoomsDAO]调用该方法
// A prototype chain mounted to Vue that can be called globally using this.[chatInRoomsDAO]
import {
    dbUser,
    chatInRoomsDAO,
    chatLocalMsgDAO,
    userListInstance,
    roomListInstance,
    userListDAO,
} from "@/services/db";
import { realDBName } from "@/services/db/db";


export const fixInfo = (status, obj) => {
    return new Promise((resolve, reject) => {
        if (status == 1) {
            queryUserByid({
                userId: obj.userId
            }).then((res) => {
                if (res) {
                    if (res.success) {
                        let datas = res.data;
                        resolve(datas);
                    } else {
                        reject(res.message);
                    }
                } else {
                    reject()
                }
            });
        } else if (status == 2) {
            // [roomId] 查询单个房间详情
            queryRoomsByIds({
                roomIds: obj.roomIds
            }).then((res) => {
                if (res && res.success) {
                    let datas = res.data[0];
                    // 获取群成员，如果是好友，可以将对应的昵称改为自己关系的备注
                    findUsersByRoomId({
                        roomId: obj.roomIds[0]
                    }).then((resp) => {
                        if (resp.success) {
                            let roomEle = resp.data || [];
                            if (roomEle.length > 0) {
                                roomEle.map(v => {
                                    v.roomInId = obj.roomIds[0];
                                    // let memKey = `${v.id}_2` // 类似 roomIdAndId
                                    // datas[memKey] = v
                                })
                            }
                            datas.chatMember = roomEle;
                            resolve(datas);
                        } else {
                            reject(resp.message);
                        }
                    });
                } else {

                    reject(res);
                }
            });
        }

    })

}

export const encrypt = (obj) => cryptos.encrypt(JSON.stringify(obj));
export const decrypt = (str) => JSON.parse(cryptos.decrypt(str));
// qckeys 如果没有共同key的话，只会取最后一个数组
export const qckeys = (arr, name) => {
    let hash = {};
    return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.unshift(next));
        return item;
    }, []);
}
export const qckeysPro = (arr, name) => {
    let hash = {};
    return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
    }, []);
};
export const getRoomIdsId = (roomIdAndId) => {
    return roomIdAndId && roomIdAndId.split("_")[0] * 1;
}
export const getRoomTypes = (roomIdAndId) => {
    return roomIdAndId && roomIdAndId.split("_")[1] * 1;
};
export const setRoomIdsId = (id, roomType) => {
        return `${id}_${roomType}`
    }
    // async await 多重复用
export const awaitWrap = (promise) => {
    return promise.then((data) => [null, data]).catch((err) => [err, null]);
};

export const combineMsg = (offLineData, rooms, friends, status) => {
    // 不仅要取Id 还要赋对象值 添加对象多余的属性
    let zid;
    if (offLineData.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
        zid = offLineData.id || offLineData.roomId;

        rooms.some((v) => {
            if (v.id == zid) {
                // 为 渲染当前聊天对象 补充数据
                offLineData = {
                    ...v,
                    ...offLineData
                };
                return true; // 找到了就退出循环
            }
        });
    } else if (offLineData.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
        zid = offLineData.id || offLineData.mid || offLineData.senderId;

        friends.some((v) => {
            if (v.id === zid) {
                offLineData = {
                    ...v,
                    ...offLineData
                };
                return true;
            }
        });
    }
    // 为1 是只取合并值
    if (status == 1) {
        // 在push 指定房间数据的同时 可以返回合并后的值
        return offLineData;
    }

    let getInstance = chatLocalMsgDAO.getInstance();
    getInstance.find(offLineData.msgId).then(result => {
        if (!result) {
            if (offLineData.isMine) {
                offLineData.roomId = offLineData.receiverId
                offLineData.id = offLineData.receiverId
                offLineData.roomIdAndId = setRoomIdsId(offLineData.receiverId, offLineData.roomType)

            } else {
                offLineData.roomId = offLineData.id
                offLineData.roomIdAndId = setRoomIdsId(offLineData.roomId, offLineData.roomType)

            }
            chatLocalMsgDAO.getInstance().add(offLineData);
            Bus.$emit("imgList", offLineData.roomIdAndId)
            getInstance
                .get()
                .then((result) => {})
                .catch((e) => {
                    console.log("err_or: ", e);
                });
        }
    })



    return offLineData;

};
// 翻译
export const isJSON = (str) => {
    if (typeof(str) === 'string') {
        try {
            let updateStr = str.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
            var obj = JSON.parse(updateStr);
            if (typeof(obj) === 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
};
export const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === "[object Object]";
}
export const hasKey = (obj, key) => {
        return isObject(obj) ? obj.hasOwnProperty(key) : false
    }
    // 撤回、删除 指定本地信息
export const delLocalMsg = (roomIdAndId, index, msgId) => {
    /* if (hasChatLocalMsgStore(1, roomIdAndId)) {
    	let oldArr = getChatLocalMsgStore(1, roomIdAndId);
    	oldArr.splice(index, 1)
    	setChatLocalMsgStore(1, roomIdAndId, oldArr);
    } */
}

//把utf16的emoji表情字符进行转码成八进制的字符
export function utf16toEntities(str) {
    var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    return typeof(str) == 'string' && str.replace(patt, function(char) {
        var H, L, code;
        if (char.length === 2) {
            H = char.charCodeAt(0); // 取出高位  
            L = char.charCodeAt(1); // 取出低位  
            code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
            return "&#" + code + ";";
        } else {
            return char;
        }
    });
}

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
export function entitiesToUtf16(str) {
    return typeof(str) == 'string' && str.replace(/&#(\d+);/g, function(match, dec) {
        let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
        let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
        return String.fromCharCode(H, L);
    });
}


export const setLocalStorage = (key, value) => {
    typeof value === "string" ? sessionStorage.setItem(key, value) : sessionStorage.setItem(key, JSON.stringify(value))
}
export const getLocalStorage = (key) => {
    let objstr = sessionStorage.getItem(key);
    let str;
    if (key == 'token') {
        str = objstr
    } else {
        str = objstr && JSON.parse(objstr);
    }
    return str || "";
}
export const removeLocalStorage = (key) => {
    sessionStorage.removeItem(key)
}
export const clearLocalStorage = () => {
    //localStorage.clear()

    let getInstance = chatLocalMsgDAO.getInstance();
    getInstance.clearData()
}

export const clearChatRoom = (id) => {
        //localStorage.clear()

        let getInstance = chatLocalMsgDAO.getInstance();
        getInstance.clearDataByRoom(id)
    }
    // 关闭ws
export const closeWS = () => {
        window.ws && window.ws.close(); // 关闭ws
        Bus.isConnect = false; //关闭连接
        clearInterval(window.heartbeatInterval); //退出登录就不用发送心跳了
    }
    // 去重
export const unique = (arr) => {
        return Array.from(new Set(arr))
    }
    // 文件大小
export const formatFileSize = (fileSize) => {
        if (fileSize < 1024) {
            return fileSize + "B";
        } else if (fileSize < 1024 * 1024) {
            var temp = fileSize / 1024;
            temp = temp.toFixed(2);
            return temp + "KB";
        } else if (fileSize < 1024 * 1024 * 1024) {
            var temp = fileSize / (1024 * 1024);
            temp = temp.toFixed(2);
            return temp + "MB";
        } else {
            var temp = fileSize / (1024 * 1024 * 1024);
            temp = temp.toFixed(2);
            return temp + "GB";
        }
    }
    // 函数防抖
    /**
     * @desc 函数防抖
     * @param func 目标函数
     * @param wait 延迟执行毫秒数
     * @param immediate true - 立即执行， false - 延迟执行
     */
export const debounce = (func, wait, immediate = false) => {
    let timer;
    return function() {
        let context = this,
            args = arguments;

        if (timer) clearTimeout(timer);
        if (immediate) {
            let callNow = !timer;
            timer = setTimeout(() => {
                timer = null;
            }, wait);
            if (callNow) func.apply(context, args);
        } else {
            timer = setTimeout(() => {
                func.apply
            }, wait)
        }
    }
}
export const VueDebounce = (fnName, time) => {
    let timeout = null;
    return function() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            this[fnName]();
        }, time);
    };
};
// 
export const delByKey = (datas, key, value) => {
    return datas.reduce((total, current) => {
        current[key] !== value && total.push(current);
        return total;
    }, []);
};
/**
 * 
 * @param {target} item 
 * @param {* 1 avatarFor 2 nameFor} status 
 * @param {* 1 private 2 group} roomTypes 
 * @param {* Whether to enforce or not} bool 
 * @returns 
 */

export const makeUserMsgs = (item, status, roomTypes = '', bool = false) => {
    return new Promise((resolve, reject) => {
        let key;
        let val;
        if (item) {

            if (item.roomIdAndId) {
                key = item.roomIdAndId;
            } else {
                if (roomTypes == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                    key = setRoomIdsId(item.id || item.roomId, roomTypes);
                } else if (roomTypes == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                    key = setRoomIdsId(item.id || item.mid, roomTypes);
                }
            }
            let roomType = getRoomTypes(key);
            if (bool) {
                roomType = roomTypes;
            }
            if (roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {

                let idf = bool ? item.senderId : getRoomIdsId(key);
                if (!idf) {
                    resolve('')
                    return
                }
                userListInstance()
                    .getInstance.find(idf)
                    .then((pickObj) => {
                        if (pickObj) {
                            if (pickObj) {
                                if (status == 1) {
                                    val = pickObj.photo;
                                } else if (status == 2) {
                                    val = pickObj.nikeName;
                                }
                            }
                        }
                        resolve(val || "");
                    }).catch((e) => {
                        console.log("eee: ", e);
                    });
            } else if (roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                if (!key) {
                    resolve('')
                    return
                }
                roomListInstance()
                    .getInstance.find(key)
                    .then((pickObj) => {
                        if (pickObj) {
                            if (status == 1) {
                                val = pickObj.logo;
                            } else if (status == 2) {
                                val = pickObj.name || item.name;
                            }
                        }
                        resolve(val || "");
                    }).catch(e => {});
            }
        }
    });
}


const CommonFn = {
    userStore,
    setUserStore,
    getUserStore,
    getChatLocalMsgStore,
    setChatLocalMsgStore,
    hasChatLocalMsgStore,
    chatInRoomsDAO,
    chatLocalMsgDAO,
    dbUser,
    userListDAO,
    userListInstance,
    roomListInstance,
    realDBName,
    setRoomIdsId,
    getRoomIdsId,
    getRoomTypes,
    awaitWrap,
    combineMsg,
    isJSON,
    isObject,
    hasKey,
    fixInfo,
    fData,
    rootConfig,
    getNowTime,
    nextWeek,
    delLocalMsg,
    utf16toEntities,
    entitiesToUtf16,
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    clearLocalStorage,
    clearChatRoom,
    closeWS,
    unique,
    formatFileSize,
    debounce,
    VueDebounce,
    qckeysPro,
    delByKey,
    makeUserMsgs,
};


const vueExtends = {
    install(Vue, options) {
        Vue.prototype.$bus = Bus;
        // 加解密
        Vue.prototype.encrypt = encrypt;
        Vue.prototype.decrypt = decrypt;
        Vue.prototype.qckeys = qckeys;
        Vue.prototype.ipcRenderer = Vue.prototype.$electron.ipcRenderer;
        Vue.prototype.$ = $;
        // Object.keys(filters).forEach(k => Vue.filter(k, filters[k])) 
        //注册过滤器
        Object.keys(filters).forEach((filterName) => {
            Vue.filter(filterName, filters[filterName]);
            Vue.prototype[filterName] = filters[filterName];
        });
        Object.keys(CommonFn).forEach(k => Vue.prototype[k] = CommonFn[k]);
        Vue.use(gallery, {
            swipeThreshold: 150, // default 100
            isIndexShow: true, // show image index, default true
            useCloseButton: false, // trigger gallery close with close button, default true
            preload: true, // preload images in the same group, default true
        });

    }
}

export default vueExtends