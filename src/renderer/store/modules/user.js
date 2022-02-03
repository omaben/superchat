import {
    login,
    loginByCode,
    logout,
    registerUser,
    getUserInfo,
    queryUserByid,
    findAllUserRelation,
    getAllTeam,
    batchSendMessage,
    batchMessage,
    /* delBatchMessage,
    clearBatchMessage */
} from "@/services/index";
import {
    getUserStore,
    setUserStore,
    loginStore,
    setChatLocalMsgStore,
} from "tool/storage";
import {
    setRoomIdsId,
} from "@/services/tool";
import { userListInstance, teamListInstance, batchListInstance, userListDAO, teamListDAO } from "@/services/db";
let common_state; // 获取rootState
let getDataBase = async() => {
    let userList = await userListDAO.getInstance().get();
    let teamList = await teamListDAO.getInstance().get();

    return {
        userList,
        teamList
    };
}
const user = {
    state: {
        //
        token: sessionStorage.getItem("token") || "", //初始化的时候取缓存,
        appConfig: sessionStorage.getItem("appConfig") || "", //初始化的时候取缓存,
        name: "",
        avatar: "",
        roles: [],
        //
        userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || {},
        friends: getDataBase().userList || [],
        teams: getDataBase().teamList || [],
        batchs: [],
        eVal: '',
        friendsObj: {},
    },
    getters: {
        userInfo: (state) => state.userInfo,
        friends: (state) => state.friends,
        teams: (state) => state.teams,
        batchs: (state) => state.batchs,
        friendsObj: (state) => state.friendsObj,
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token; // 这里取是为了数据一致性
            // setUserStore("token", token);
            sessionStorage.setItem("token", token);
        },
        SET_APP_CONFIG: (state, appConfig) => {
            state.appConfig = appConfig; // 这里取是为了数据一致性
            // setUserStore("token", token);
            sessionStorage.setItem("appConfig", appConfig);
        },
        SET_EVAL: (state, eVal) => {
            state.eVal = eVal;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
            setTimeout(() => {
                setChatLocalMsgStore("userInfo", "", userInfo);
                setChatLocalMsgStore("token", "", state.token);
            }, 500);
        },
        SET_FRIENDS: (state, friends) => {
            state.friends = friends;
        },
        SET_TEAMS: (state, teams) => {
            state.teams = teams;
        },
        SET_BATCH: (state, batchs) => {
            state.batchs = batchs;
        },
        UPDATE_FRIENDS: (state, friend) => {
            state.friends = state.friends.map((v) => {
                if (v.id === friend.id) {
                    v = friend;
                    userListInstance().editInstance(v);
                }
                return v;
            });
        },
        DEL_FRIENDS: (state, id) => {
            let it = state.friends.filter((item) => item.id === id) || [];
            if (it.length > 0) {
                userListInstance().delListIns(it[0]);
            }
            state.friends = state.friends.filter((item) => item.id !== id);

        },
        ADD_FRIENDS: (state, friend) => {
            const found = state.friends.filter(item => item.id == friend.id) || []
            if (found.length == 0) {
                state.friends.push(friend);
            }
            userListInstance().editInstance(friend);
        },
        ADD_BATCH: (state, batch) => {
            const found = state.batchs.filter(item => item.id == batch.id) || []
            if (found.length == 0) {
                state.batchs.push(batch);
            }
            batchListInstance().editInstance(batch);
        },

    },

    actions: {
        // 登录
        Login({ commit }, post) {

            return new Promise((resolve, reject) => {
                let func;
                if (post.logStatus == 1 || post.logStatus == 3) {
                    func = login;
                } else if (post.logStatus == 2) {
                    func = loginByCode;
                }
                func(post)
                    .then((res) => {
                        const deData = res;
                        if (deData.success) {
                            commit("SET_TOKEN", deData.data);
                            loginStore.set("isLogin", true);
                            commit("SET_ROLES", ["admintry"]);
                            resolve()
                        } else {
                            commit("SET_TOKEN", "");
                            loginStore.set("isLogin", false);
                            commit("SET_ROLES", []);
                            reject(deData.message);
                        }
                    })
                    .catch((error) => {
                        console.log("err: ", error);
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo()
                    .then((res) => {
                        let dedata = res;
                        if (dedata && dedata.success) {
                            commit("SET_ROLES", ["admintry"]);
                            let userInfo = dedata.data;
                            commit("SET_USERINFO", userInfo);
                            userListInstance().editInstance(userInfo);
                            resolve(userInfo);
                        } else {
                            reject(res.message);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 登出
        // todo 多开的时候需要数据初始化，监听是否开启多开状态
        // 如果开启多开状态，则直接开启初始化，让数据重新渲染
        // 用 localStorage 判断 各个多开状态 是否开启关闭
        // 多开开启时 更改electron-store
        // electron-store为全局共享 localStorage只需要取当前一次即可确认
        LogOut({ commit, state, dispatch }) {
            return new Promise((resolve, reject) => {
                logout({})
                    .then((res) => {
                        let deData = res;
                        if (deData.success) {
                            // store init

                            // 删除指定会员的缓存
                            // delUserLocalMsgStore(state.userInfo.id);

                            // vuex init
                            commit("SET_TOKEN", "");
                            commit("SET_ROLES", []);
                            loginStore.set("isLogin", false);

                            sessionStorage.setItem("token", "");
                            sessionStorage.setItem("userInfo", "{}");
                            setChatLocalMsgStore("token", "", "");
                            setChatLocalMsgStore("userInfo", "", {});
                            dispatch("SetChatInRooms", []); // 退出重置正在聊天的房间 init
                            // commit("SET_CHATIN_ROOMSPRO", {}); // 根据roomIdAndId 扩展的属性值
                            commit("SET_NOTICEMSG", []); // 通知消息
                            // commit("SET_UNREAD_NUM", 0); // 正在聊天房间的消息未读总数
                            commit("SET_CUSTOM_FACE", {}); // 自定义表情
                            // 不删除store的话 需要重新reload 才能渲染正确的vuex

                            resolve();
                        } else {
                            reject(deData.message);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },
        initStates({ commit, state, dispatch }) {
            return new Promise((resolve, reject) => {
                // vuex init
                commit("SET_TOKEN", "");
                commit("SET_ROLES", []);
                loginStore.set("isLogin", false);

                sessionStorage.setItem("token", "");
                sessionStorage.setItem("userInfo", "{}");
                setChatLocalMsgStore("token", "", "");
                setChatLocalMsgStore("userInfo", "", {});

                dispatch("SetChatInRooms", []); // 退出重置正在聊天的房间 init
                commit("SET_CHATIN_ROOMSPRO", {}); // 根据roomIdAndId 扩展的属性值
                commit("SET_NOTICEMSG", []); // 通知消息
                commit("SET_UNREAD_NUM", 0); // 正在聊天房间的消息未读总数
                commit("SET_CUSTOM_FACE", {}); // 自定义表情
                // 不删除store的话 需要重新reload 才能渲染正确的vuex

                resolve();
            })
        },
        // Register 注册
        RegisterUser({ commit }, post) {
            return new Promise((resolve, reject) => {

                registerUser(post).then((res) => {
                    let deData = res;
                    // let deData = decrypt(data);
                    if (deData.success) {
                        let token = deData.data || deData.token || "";
                        commit("SET_TOKEN", token);
                        commit("SET_ROLES", [post.account]);
                        resolve();
                    } else {
                        reject(deData.message);
                    }
                });
            });
        },

        // 获取好友列表
        GetFriends({ commit, rootState }) {
            common_state = rootState;
            return new Promise((resolve, reject) => {
                let arr = [];
                findAllUserRelation().then(async(res) => {
                    let dedate = res;
                    if (dedate && dedate.success) {
                        dedate.data.users.map((v) => {
                            // update list
                            userListInstance().editInstance(v);
                            if (v.status == 2) {
                                // 1是被好友加 2是好友 3是拒绝加的好友
                                v.roomIdAndId = setRoomIdsId(v.id, 1);
                                arr.push(v);
                            }
                        });
                        commit("SET_FRIENDS", arr);
                        resolve();
                    } else {
                        let friends = await userListDAO.getInstance().get();
                        console.log(friends, 'friends')
                        commit("SET_FRIENDS", friends);
                        //reject(dedate.message);
                    }
                });
            });
        },
        GetTeams({ commit, rootState }) {
            common_state = rootState;
            return new Promise((resolve, reject) => {
                let arr = [];
                getAllTeam().then(async(res) => {
                    let dedate = res;
                    if (dedate && dedate.success) {
                        dedate.data.map((v) => {
                            // update list
                            teamListInstance().editInstance(v);
                            // 1是被好友加 2是好友 3是拒绝加的好友
                            arr.push(v);
                        });
                        commit("SET_TEAMS", arr);
                        resolve();
                    } else {
                        let teams = await teamListDAO.getInstance().get();
                        console.log(teams, 'teams')
                        commit("SET_TEAMS", teams);
                        //reject(dedate.message);
                    }
                });
            });
        },
        GetBatchs({ commit, rootState }) {
            common_state = rootState;
            return new Promise((resolve, reject) => {
                let arr = [];
                batchMessage().then((res) => {
                    let dedate = res;
                    if (dedate && dedate.success) {
                        dedate.data.map((v) => {
                            // update list
                            batchListInstance().editInstance(v);
                            // 1是被好友加 2是好友 3是拒绝加的好友
                            arr.push(v);
                        });
                        commit("SET_BATCH", arr);
                        resolve();
                    } else {
                        //reject(dedate.message);
                    }
                });
            });
        },
        AddBatch({ commit }, batch) {
            // 添加好友 添加房间 判断是否等于 delkey
            // _1:秘聊
            return new Promise((resolve, reject) => {
                batchSendMessage(batch).then((res) => {
                    let dedate = res;
                    if (dedate.success) {
                        resolve();
                    } else {
                        reject(dedate.message);
                    }
                });
            });
        },

        UpdateFriends({ commit }, friend) {
            commit("UPDATE_FRIENDS", friend);
        },
        DelFriends({ commit }, id) {
            commit("DEL_FRIENDS", id);
        },
        AddFriends({ commit }, friend) {
            // 添加好友 添加房间 判断是否等于 delkey
            // _1:秘聊
            let roomIdAndId = `${friend.id || friend.mid}_1`;
            if (
                getUserStore("DELKEY") == roomIdAndId ||
                getUserStore("DELKEY") == "null"
            ) {
                setUserStore("DELKEY", "");
            }
            friend.roomIdAndId = roomIdAndId;
            commit("ADD_FRIENDS", friend);
        },
    },
};

export default user