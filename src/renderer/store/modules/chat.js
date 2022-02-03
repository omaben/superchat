/* eslint-disable no-console */
import { findUsersByRoomId, queryRoomsByIds, findAllRoomRelation, delUserSessionList, topMessage, queryUserByid, doNotDistrub } from "@/services";
import Bus from "@/services/bus";
import MSG_TYPE from "@/services/im/constant";
import { chatInRoomsDAO, userListDAO, roomListDao } from "@/services/db";

import {
    setUserStore,
    getUserStore,
    getChatLocalMsgStore,
    setChatLocalMsgStore,
    hasChatLocalMsgStore,
    delChatLocalMsgStore,
} from "tool/storage";
import {
    qckeys,
    fixInfo,
    setRoomIdsId,
    getRoomTypes
} from "@/services/tool";
import { roomListInstance, userListInstance } from "@/services/db";

let getDataBase = async() => {
    let chatInRooms = await chatInRoomsDAO.getInstance().get();
    let rooms = await roomListDao.getInstance().get();

    return {
        chatInRooms,
        rooms
    };
}

const chat = {
    state: {

        chatInfo: {
            id: -1,
            memberNum: -1, //会员数量
        },
        chatMembers: [],
        rooms: getDataBase().rooms || [],
        roomsObj: {},
        roomsMemberObj: {},
        usersObj: {},
        boxChat: false,
        serieManage: false,
        broadcastList: false,
        notification: false,
        createGroup: false,
        detailGroup: false,
        detailFriend: false,
        mutedList: false,
        mutedListData: [],

        // ongoing message room || getChatLocalMsgStore(2)
        chatInRooms: getDataBase().chatInRooms || [], // 进行中的消息房间
        // Take directly according to the extended attribute value of roomIdAndId - the array in vuex cannot modify the value of the specified object
        chatInRoomsPro: getChatLocalMsgStore(5) || {}, // 根据roomIdAndId 扩展的属性值 直接取 -- vuex中数组修改指定对象值不行
    },
    getters: {
        chatInfo: (state) => state.chatInfo,
        chatMembers: (state) => state.chatMembers,
        rooms: (state) => state.rooms,
        roomsObj: (state) => state.roomsObj,
        roomsMemberObj: (state) => state.roomsMemberObj,
        usersObj: (state) => state.usersObj,
        chatInRooms: (state) => state.chatInRooms,
        chatInRoomsPro: (state) => state.chatInRoomsPro,
        boxChat: (state) => state.boxChat,
        serieManage: (state) => state.serieManage,
        broadcastList: (state) => state.broadcastList,
        notification: (state) => state.notification,
        createGroup: (state) => state.createGroup,
        detailGroup: (state) => state.detailGroup,
        detailFriend: (state) => state.detailFriend,
        mutedList: (state) => state.mutedList,
        mutedListData: (state) => state.mutedListData,
    },

    mutations: {
        SET_CHATBOX: (state, info) => {
            state.boxChat = info;
        },
        SET_SERIEMANAGE: (state, info) => {
            state.serieManage = info;
        },
        SET_BROADCASTLIST: (state, info) => {
            state.broadcastList = info;
        },
        SET_NOTIFICATION: (state, info) => {
            state.notification = info;
        },
        SET_CREATEGROUP: (state, info) => {
            state.createGroup = info;
        },
        SET_DETAILGROUP: (state, info) => {
            state.detailGroup = info;
        },
        SET_DETAILFRIEND: (state, info) => {
            state.detailFriend = info;
        },

        SET_MUTEDLIST: (state, { item, data }) => {
            state.mutedList = item;
            state.mutedListData = data;
        },


        SET_CHATINFO: (state, info) => {
            if (info) {

                info.avatar = info.name || info.nikeName || info.receiver
                state.chatInfo = info;
                state.notification = false;
                state.broadcastList = false;
            }
        },
        SET_CHATMEMS: (state, chatMembers) => {
            state.chatMembers = chatMembers;
        },
        SET_ROOMSOBJ: (state, roomsObj) => {
            state.roomsObj = roomsObj;
            setChatLocalMsgStore(11, "", state.roomsObj);
        },
        SET_MEMBEROBJ: (state, roomsMemberObj) => {
            state.roomsMemberObj = roomsMemberObj;
            setChatLocalMsgStore(9, "", state.roomsMemberObj);
        },
        UPDATE_CHATMEMS: (state, chatMember) => {
            state.chatMembers = state.chatMembers.map((v) => {
                if (v.id === chatMember.id) {
                    v = chatMember;
                }
                return v;
            });
        },
        REMOVE_CHATMEM: (state, id) => {

            state.chatMembers = state.chatMembers.filter(
                (item) => {
                    item.id !== id

                }

            );
        },
        SET_ROOMRS: (state, rooms) => {
            state.rooms = rooms;
            //SetRoomsObj(state);
        },
        UPDATE_ROOMS: (state, room) => {

            state.rooms = state.rooms.map((v) => {
                if (v.id === room.id) {
                    v = room;
                    roomListInstance().editInstance(v)
                    let getInstance = chatInRoomsDAO.getInstance();
                    getInstance.find(v.roomIdAndId)
                        .then((result) => {
                            let upData = {...result }
                            upData.name = v.name
                            upData.nikeName = v.nikeName || v.name
                            upData.logo = v.logo
                            upData.avatar = v.name || v.nikeName
                            upData.msgDoNotDisturb = v.msgDoNotDisturb
                            getInstance.update(upData).then(() => {
                                getInstance.get().then(result => {
                                    state.chatInRooms = result;
                                })
                            })
                        })



                }
                return v;
            });

            setChatLocalMsgStore(7, "", state.rooms);
            SetRoomObjf(state);

            // SetRoomsObj(state); todo -- delete no-use data
        },
        DEL_ROOMS: (state, id) => {
            let it = state.rooms.filter((item) => item.id === id) || [];
            if (it.length > 0) {
                roomListInstance().delListIns(it[0]);
            }
            state.rooms = state.rooms.filter((item) => item.id !== id);

            setChatLocalMsgStore(7, "", state.rooms);
            SetRoomObjf(state);
        },
        ADD_ROOMS: (state, room) => {
            state.rooms.push(room);
            state.rooms = qckeys(state.rooms, "id");
            roomListInstance().editInstance(room)

            setChatLocalMsgStore(7, "", state.rooms);
            SetRoomObjf(state);

        },
        SET_CHATIN_ROOMS: (state, chatInRooms) => {
            state.chatInRooms = chatInRooms;
            // setUserStore("chatInRooms", state.chatInRooms);

            //setChatLocalMsgStore(2, "", state.chatInRooms);
        },
        SET_CHATIN_ROOMSPRO: (state, chatInRoomsPro) => {
            state.chatInRoomsPro = chatInRoomsPro;
            setChatLocalMsgStore(5, "", state.chatInRoomsPro);
        },
        UPDATE_CHATIN_ROOMS: (state, chatInRoom) => {
            if (chatInRoom.updIndex > -1) {
                state.chatInRooms[chatInRoom.updIndex] = chatInRoom;
            } else {
                state.chatInRooms = state.chatInRooms.map((v) => {
                    if (v.roomIdAndId === chatInRoom.roomIdAndId) {
                        v = chatInRoom;
                    }
                    return v;
                });
            }
            //setChatLocalMsgStore(2, "", state.chatInRooms);
        },
        DEL_CHATIN_ROOMS: (state, { roomIdAndId, roomType }) => {
            state.chatInRooms = state.chatInRooms.filter(
                (item) => item.roomIdAndId !== roomIdAndId
            );
            // 删除聊天信息
            // Delete chat information
            // 删除指定房间的消息 -- 及 中间缓存信息-数据库信息

            chatInRoomsDAO.getInstance().deleteByID(roomIdAndId);
            chatInRoomsDAO
                .getInstance()
                .get()
                .then((result) => {
                    state.chatInRooms = result;
                });
            // Delete the message of the specified room - and the intermediate cache information-database information
            if (hasChatLocalMsgStore(1, roomIdAndId)) {
                // setChatLocalMsgStore(1, roomIdAndId, []);
                delChatMsgCacheData(roomIdAndId);
                delChatLocalMsgStore(1, roomIdAndId);
            }
            //setChatLocalMsgStore(2, "", state.chatInRooms);
            state.boxChat = false

        },
        ADD_CHATIN_ROOMS: (state, chatInRoom) => {
            // 添加好友 添加房间 判断是否等于 delkey . 只有退出之后清除用户数据
            // Add friends and add rooms to determine whether it is equal to delkey. Only after logging out, clear user data
            if (
                getUserStore("DELKEY") == chatInRoom.roomIdAndId ||
                getUserStore("DELKEY") == "null"
            ) {
                // DELKEY = ''
                setUserStore("DELKEY", "");
            }
            if (
                chatInRoom.roomIdAndId == `NaN_${chatInRoom.roomType}` ||
                chatInRoom.roomIdAndId == `undefined_${chatInRoom.roomType}`
            ) {
                return;
            }
            // roomType不存在 直接返回
            // roomType does not exist, return directly
            if (!getRoomTypes(chatInRoom.roomIdAndId)) {
                return;
            }
            let getInstance = chatInRoomsDAO.getInstance();

            if (state.chatInRooms instanceof Array) {
                // electron-store
                // state.chatInRooms.unshift(chatInRoom);
                // 去前面的重
                // Remove the duplicate
                // state.chatInRooms = qckeys(state.chatInRooms, "roomIdAndId");
                // state.chatInRooms = state.chatInRooms.reverse();
                // setChatLocalMsgStore(2, "", state.chatInRooms);
                // Dexie.js
                let allCount = getChatLocalMsgStore(4);
                if (!allCount) {
                    allCount = 0
                }
                getInstance.find(chatInRoom.roomIdAndId).then((result) => {
                    /* if(!chatInRoom.unReadNum){
                    	chatInRoom.unReadNum=0
                    } */


                    if (result) {
                        chatInRoom.msgDoNotDisturb = result.msgDoNotDisturb
                            //let mineId = rootState.user.userInfo.id;
                        if (chatInRoom.isMine) {
                            chatInRoom.msgDoNotDisturb = result.msgDoNotDisturb
                            chatInRoom.avatar = result.avatar
                            chatInRoom.nikeName = result.nikeName || result.name
                            chatInRoom.name = result.name
                            chatInRoom.logo = result.logo
                            chatInRoom.photo = result.photo
                        }
                        getInstance.update(chatInRoom);
                        getInstance
                            .get()
                            .then((result) => {
                                state.chatInRooms = result;
                            })
                            .catch((e) => {
                                console.log("err_or: ", e);
                            });
                    } else {
                        chatInRoom.resend = false

                        getInstance.add(chatInRoom)
                        getInstance
                            .get()
                            .then((result) => {
                                // console.log("indexedb_get", result);


                                state.chatInRooms = result;
                            })
                            .catch((e) => {
                                console.log("err_or: ", e);
                            });
                    }
                });

            }

        },
        UPDATE_USERS_OBJ: (state, userObj) => {

            let usersObjs = state.usersObj;

            userListInstance().editInstance(userObj)
                // 存在相同key 则需要覆盖
                // If the same key exists, it needs to be overwritten
            let getInstance = chatInRoomsDAO.getInstance();
            if (userObj.roomIdAndId) {

                getInstance.find(userObj.roomIdAndId)
                    .then((result) => {

                        let upData = {...result }
                        upData.name = userObj.name
                        upData.nikeName = userObj.nikeName
                        upData.logo = userObj.logo || userObj.photo
                        upData.avatar = userObj.nikeName || userObj.name
                        upData.lastOnlineTime = userObj.lastOnlineTime
                        upData.lastOnlineTime = userObj.lastOnlineTime
                        upData.onlineStatus = userObj.onlineStatus
                        if (state.chatInfo.roomIdAndId === userObj.roomIdAndId) {
                            state.chatInfo = upData
                        }
                        getInstance.update(upData).then(() => {
                            getInstance.get().then(result => {
                                state.chatInRooms = result;
                            })
                        })
                    })
            }

            if (usersObjs.hasOwnProperty(userObj.id)) {
                // console.log("objId: ", userObj.id);
                let obj = {...usersObjs[userObj.id], ...userObj };

                usersObjs[userObj.id] = obj;
                setChatLocalMsgStore(12, obj.id, obj);
            } else {
                usersObjs[userObj.id] = userObj;
                setChatLocalMsgStore(12, userObj.id, userObj);
            }

        },
        DEL_USERS_OBJ: (state, userObj) => {
            delete state.usersObj[userObj.id];
            if (hasChatLocalMsgStore(12, userObj.id)) {
                delChatLocalMsgStore(12, userObj.id);
            }
        },

    },

    actions: {

        SetChatBox: ({ commit }, item) => {
            commit("SET_CHATBOX", item);
        },
        SetSerieManage: ({ commit }, item) => {
            commit("SET_SERIEMANAGE", item);
        },
        SetBroadcastList: ({ commit }, item) => {
            commit("SET_BROADCASTLIST", item);
        },
        SetNotification: ({ commit }, item) => {
            commit("SET_NOTIFICATION", item);
        },
        setCreateGroup: ({ commit }, item) => {
            commit("SET_CREATEGROUP", item);
        },
        setDetailGroup: ({ commit }, item) => {
            commit("SET_DETAILGROUP", item);
        },
        setDetailFriend: ({ commit }, item) => {
            commit("SET_DETAILFRIEND", item);
        },

        setMutedList: ({ commit }, { item, data }) => {
            commit("SET_MUTEDLIST", { item, data });
        },
        SetChatInfo: ({ commit }, item) => {
            commit("SET_CHATINFO", item);
        },
        SetRoomInfo: ({ commit, dispatch }, { roomId, status }) => {
            return new Promise((resolve, reject) => {
                queryRoomsByIds({ roomIds: [roomId] }).then((res) => {
                    if (res.success) {
                        let datas = res.data[0];
                        datas.roomType = 2;
                        datas.roomIdAndId = setRoomIdsId(roomId, 2);
                        // 设置当前聊天房间信息
                        // Set the current chat room information
                        if (!status) {
                            console.log(status)
                            commit("SET_CHATINFO", datas);
                        }
                        commit("UPDATE_ROOMS", datas);
                        datas.members.map(v => {
                                queryUserByid({ userId: v.id }).then((dataInfo) => {
                                    if (dataInfo.success) {
                                        let data = dataInfo.data;
                                        userListInstance().editInstance(data);
                                    }
                                })

                            })
                            // dispatch("AddChatInRooms", datas);
                        resolve();
                    } else {
                        reject(res.message);
                    }
                });
            });
        },
        SetChatMembers: ({ commit, state }, roomId) => {

            return new Promise((resolve, reject) => {
                // 获取群成员，如果是好友，可以将对应的昵称改为自己关系的备注
                // Get group members, if you are a friend, you can change the corresponding nickname to a note about your relationship
                findUsersByRoomId({ roomId: roomId }).then((res) => {
                    if (res && res.success) {
                        let roomEle = res.data || [];
                        // this.$store.dispatch('SetChatMembers', this.roomEle)
                        // this.$store.dispatch('SetChatMembers', this.roomEle)
                        commit("SET_CHATMEMS", roomEle);
                        // 需要更新会员信息 roomsMemberObj
                        // Need to update member information roomsMemberObj
                        updateRoomsMemberObj(state, commit, roomEle, roomId);
                        resolve();
                    } else {
                        //reject(res.message);
                    }
                });
            });
        },
        RemoveChatMem: ({ commit }, id) => {
            commit("REMOVE_CHATMEM", id);
        },
        // 查询用户全部群
        // Query all groups of users
        FindRoomRelation({ commit }) {
            return new Promise((resolve, reject) => {
                let arr = [];
                findAllRoomRelation().then(async(res) => {
                    if (res && res.success) {
                        res.data.map((v) => {
                            v.roomIdAndId = setRoomIdsId(v.id, 2);
                            roomListInstance().editInstance(v);
                            arr.push(v);
                        });
                        commit("SET_ROOMRS", arr);
                        resolve();
                    } else {
                        let rooms = await roomListDao.getInstance().get();
                        commit("SET_ROOMRS", rooms);
                        //reject(res.message);
                    }
                });
            });
        },

        // 删除房间
        // delete room
        DelRooms({ commit }, id) {
            commit("DEL_ROOMS", id);
        },
        // 添加房间
        // add room
        AddRooms({ commit }, room) {
            // 添加好友 添加房间 判断是否等于 delkey
            // Add friends, add rooms, determine whether it is equal to delkey
            // _2:群聊
            let roomIdAndId = `${room.id}_2`;
            if (
                getUserStore("DELKEY") == roomIdAndId ||
                getUserStore("DELKEY") == "null"
            ) {
                setUserStore("DELKEY", "");
            }
            room.roomIdAndId = roomIdAndId;
            commit("ADD_ROOMS", room);
        },

        // 进行中的消息房间
        // ongoing message room
        SetChatInRooms({ commit }, chatInRooms) {
            commit("SET_CHATIN_ROOMS", chatInRooms);
        },
        UpdateChatInRooms({ commit, state }, chatInRoom) {
            commit("UPDATE_CHATIN_ROOMS", chatInRoom);
        },
        //pin chat
        async pinChatRoom({ commit, state, dispatch }, chatInRoom) {

            let id = chatInRoom.id;
            /* if(chatInRoom.roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
            	id = chatInRoom.id
            }else if(chatInRoom.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC){
            	id = chatInRoom.roomId
            	console.log(chatInRoom,chatInRoom.id,'chatInRoomchatInRoom1')
            } */
            let post = {
                id: id,
                receiverType: chatInRoom.roomType,
                status: chatInRoom.topStatus
            }
            let resp = await topMessage(post)
            if (resp.success) {
                dispatch("AddChatInRooms", chatInRoom);
                roomListInstance().editInstance(chatInRoom)

            } else {
                Bus.$emit("show_dialog_err", resp.message);
                return
            }

        },
        //disturb chat
        async disturbChatRoom({ commit, state }, chatInRoom) {

            let id = chatInRoom.id;
            /* if(chatInRoom.roomType==MSG_TYPE.RECEIVE_TYPE_PRIVATE){
            	id = chatInRoom.id
            }else if(chatInRoom.roomType==MSG_TYPE.RECEIVE_TYPE_PUBLIC){
            	id = chatInRoom.roomId
            	console.log(chatInRoom,chatInRoom.id,'chatInRoomchatInRoom1')
            } */
            let post = {
                id: id,
                receiverType: chatInRoom.roomType,
                msgDoNotDisturb: chatInRoom.msgDoNotDisturb
            }
            let resp = await doNotDistrub(post)
            if (resp.success) {
                chatInRoomsDAO.getInstance().update(chatInRoom)
                chatInRoomsDAO
                    .getInstance()
                    .get()
                    .then((result) => {
                        state.chatInRooms = result;
                    });
            } else {
                Bus.$emit("show_dialog_err", resp.message);
                return
            }

        },
        // 清除聊天 => 清除聊天室+清除聊天记录
        // Clear chat => Clear chat room + clear chat history
        async DelChatInRooms({ commit, state }, chatInRoom) {


            let id;
            if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                id = chatInRoom.id
            } else if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
                id = chatInRoom.roomId
            }

            let post = {
                id: id,
                receiverType: chatInRoom.roomType
            };
            let resp = await delUserSessionList(post)
            if (resp.success) {
                chatInRoomsDAO.getInstance().delete(chatInRoom);
                chatInRoomsDAO
                    .getInstance()
                    .get()
                    .then((result) => {
                        state.chatInRooms = result;
                    });
            } else {
                Bus.$emit("show_dialog_err", resp.message);
                return
            }


            // 设置共同去重key
            // Set common deduplication key
            if (chatInRoom.id) {
                chatInRoom.roomIdAndId = setRoomIdsId(
                    chatInRoom.id,
                    chatInRoom.roomType
                );
                commit("DEL_CHATIN_ROOMS", chatInRoom);
                return;
            } else if (chatInRoom.roomId) {
                chatInRoom.roomIdAndId = setRoomIdsId(
                    chatInRoom.roomId,
                    chatInRoom.roomType
                );
                commit("DEL_CHATIN_ROOMS", chatInRoom);
                return;
            } else if (chatInRoom.roomIdAndId) {
                commit("DEL_CHATIN_ROOMS", chatInRoom);
                return;
            }
        },
        async editUserInstance(uid) {

            let userInfo = await fixInfo(1, {
                userId: uid,
            }).catch((err) => {
                this.$bus.$emit('show_dialog_err', err)
            });

            if (userInfo) {
                await userListInstance().editInstance(userInfo)
            }
        },
        async UpdateStatus({ state, commit }, friend) {
            queryUserByid({ userId: friend.userId }).then((dataInfo) => {
                if (dataInfo.success) {
                    let data = dataInfo.data;
                    data.roomIdAndId = setRoomIdsId(data.id, 1);
                    commit("UPDATE_USERS_OBJ", data);
                }
            })
        },

        // todo for循环不需要赋值多次 给定一个标志位判断是否需要循环 不是则跳过
        async AddChatInRooms({ state, commit, rootState, dispatch },
            chatInRoom
        ) {
            // 群解散特殊处理
            // Special handling for group dissolution
            if (chatInRoom.msg && chatInRoom.msg !== null) {
                if (
                    chatInRoom.msg.noticeType &&
                    chatInRoom.msg.noticeType === MSG_TYPE.ROOM_DEL
                ) {
                    chatInRoom.roomIdAndId = setRoomIdsId(chatInRoom.roomId, 2);
                    dispatch("DelChatInRooms", chatInRoom);
                    return;
                }
            }

            let mineId = rootState.user.userInfo.id;

            if (chatInRoom.senderId) {
                if (chatInRoom.senderId == mineId) {
                    // console.log('房间发送人是自己')
                    chatInRoom.isMine = MSG_TYPE.IS_MINE;
                } else {
                    chatInRoom.isMine = MSG_TYPE.NO_MINE;
                }
            }

            // 如果为密聊 则赋更多的值
            // If it is a secret chat, assign more values
            if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
                if (!chatInRoom.roomIdAndId) {
                    chatInRoom.id = chatInRoom.senderId;
                }
                if (chatInRoom.isOffLineMsg) {
                    // 离线消息没有自己跟自己发送消息
                    // Offline messages did not send messages to themselves
                    if (chatInRoom.senderId == mineId) return;
                    // 离线消息接受消息为自己才处理
                    // Offline messages accept messages for themselves to process
                    if (chatInRoom.receiverId == mineId) {
                        if (chatInRoom.senderId !== mineId) {
                            chatInRoom.id = chatInRoom.senderId;
                            chatInRoom.roomIdAndId = setRoomIdsId(
                                chatInRoom.id,
                                1
                            );
                        }
                    }
                } else {
                    chatInRoom.isOffLineMsg = false;
                }

                if (!chatInRoom.hasInfo) {
                    let flaguser = true;
                    // 如果是好友的话可以直接赋值。
                    // If it is a friend, you can assign it directly.
                    rootState.user.friends.some((v) => {
                        if (v.id === chatInRoom.mid || v.id === chatInRoom.id) {
                            chatInRoom = {...v, ...chatInRoom };
                            flaguser = false;
                            return true;
                        }
                    });
                    // 还有一种情况就是 房间不在已知的房间信息、好友不在已知的好友信息里面
                    // Another situation is that the room is not in the known room information, and the friend is not in the known friend information
                    // 这时就需要重新请求房间或者好友详情了
                    // At this time, you need to request the room or friend details again
                    if (flaguser) {
                        let userInfo = await userListDAO.getInstance().find(chatInRoom.mid || chatInRoom.id)
                        if (userInfo) {
                            chatInRoom = {...userInfo, ...chatInRoom };
                        }
                        /* let userInfo = await fixInfo(1, {
                        	userId: chatInRoom.mid || chatInRoom.id,
                        }).catch((err) => {
                        	console.log("show_dialog_err: ", err);
                        	Bus.$emit("show_dialog_err", err);
                        }); */

                    }
                }
            } else if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {

                // &&chatInRoom.roomId !=
                if (chatInRoom.isOffLineMsg) {
                    if (chatInRoom.senderId == mineId) return;
                } else {
                    chatInRoom.isOffLineMsg = false;
                }
                if (!chatInRoom.hasInfo) {
                    let flagroom = true;
                    // 私聊、密聊都要推送到对应的消息界面
                    // Private chat and secret chat must be pushed to the corresponding message interface
                    state.rooms.some((v) => {
                        if (v.id == chatInRoom.roomId) {
                            // 为 渲染当前聊天对象 补充数据
                            // Supplementary data for rendering the current chat object
                            chatInRoom = {...v, ...chatInRoom };
                            flagroom = false;
                            return true; // 找到了就退出循环
                        }
                    });
                    // 还有一种情况就是 房间不在已知的房间信息、好友不在已知的好友信息里面
                    // 这时就需要重新请求房间或者好友详情了
                    // Another situation is that the room is not in the known room information, and the friend is not in the known friend information
                    // At this time, you need to request the room or friend details again
                    if (flagroom) {
                        let chatInRoomID = chatInRoom

                        let roomInfo = await roomListDao.getInstance().findByRoomId(chatInRoomID.id || chatInRoomID.roomId);

                        if (roomInfo) {

                            chatInRoom = {...roomInfo, ...chatInRoomID };
                        }
                        /* let roomInfo = await fixInfo(2, {
                        	roomIds: [chatInRoomID.id],
                        }).catch((err) => {
                        	console.log("show_dialog_err: ", err);
                        	Bus.$emit("show_dialog_err", err);
                        });
                        if (roomInfo) {
                        	chatInRoom = { ...roomInfo, ...chatInRoomID };
                        } */
                    }
                }
            }

            chatInRoom.avatar = chatInRoom.name || chatInRoom.nikeName || chatInRoom.receiver
            chatInRoom.logo = chatInRoom.logo || chatInRoom.photo || ''


            if (chatInRoom.msgDoNotDisturb === 0) {
                chatInRoom.msgDoNotDisturb = 2
            }
            // 设置共同去重key
            if (chatInRoom.roomIdAndId) {

                commit("ADD_CHATIN_ROOMS", chatInRoom);
                return;
            } else if (chatInRoom.id) {

                chatInRoom.roomIdAndId = setRoomIdsId(
                    chatInRoom.id,
                    chatInRoom.roomType
                );
                commit("ADD_CHATIN_ROOMS", chatInRoom);
                return;
            } else if (chatInRoom.roomId) {

                chatInRoom.roomIdAndId = setRoomIdsId(
                    chatInRoom.roomId,
                    chatInRoom.roomType
                );
                commit("ADD_CHATIN_ROOMS", chatInRoom);
                return;
            }
        },
        SetChatInRoomsPro({ state, commit }, { roomIdAndId, key, val }) {
            // {
            // 		[roomIdAndId]: {...attr}
            // }
            let proObj = {...state.chatInRoomsPro };
            if (!proObj[roomIdAndId]) {
                proObj[roomIdAndId] = {};
            }
            if (key === "unReadNum" && !val && val != 0) {
                if (!proObj[roomIdAndId][key]) {
                    proObj[roomIdAndId][key] = 1;
                } else {
                    proObj[roomIdAndId][key] += 1;
                }
            } else {
                proObj[roomIdAndId][key] = val;
            }

            commit("SET_CHATIN_ROOMSPRO", proObj);
        },
        UpdateChatInRoomsPro({ state, commit }, { roomIdAndId, key, val }) {
            // {
            // 		[roomIdAndId]: {...attr}
            // }
            let proObj = {...state.chatInRoomsPro };
            if (!proObj[roomIdAndId]) {
                proObj[roomIdAndId] = {};
            }
            proObj[roomIdAndId][key] = val;

            commit("SET_CHATIN_ROOMSPRO", proObj);
        },
    },
};
// SET_ROOMSOBJ
export const SetRoomsObj = async(state) => {
    let rooms = state.rooms
    setChatLocalMsgStore(7, "", rooms);

    if (rooms.length > 0) {
        let roomsObj = {};
        let roomsMemberObj = {};
        for (let i = 0; i < rooms.length; i++) {
            let v = rooms[i]
            roomsObj[v.roomIdAndId] = v;
            let resp = await findUsersByRoomId({ roomId: v.id });
            if (resp.success) {
                let roomEle = resp.data || [];
                let roomEleObj = {}
                if (roomEle.length > 0) {
                    roomEle.map((v2) => {
                        v2.roomInId = v.id;
                        roomEleObj[v2.id] = v2

                        state.usersObj[v2.id] = v2;
                        setChatLocalMsgStore(12, v2.id, v2);

                    });
                }
                roomsMemberObj[v.roomIdAndId] = roomEleObj;
            } else {
                Bus.$emit("show_dialog_err", resp.message);
            }
        }
        state.roomsObj = roomsObj;
        setChatLocalMsgStore(11, "", state.roomsObj);
        state.roomsMemberObj = roomsMemberObj;
        setChatLocalMsgStore(9, "", state.roomsMemberObj);

    }
}

export const SetRoomObjf = (state) => {
    let rooms = state.rooms;
    if (rooms.length > 0) {
        let roomsObj = {};
        for (let i = 0; i < rooms.length; i++) {
            let v = rooms[i];
            roomsObj[v.roomIdAndId] = v;
        }
        state.roomsObj = roomsObj;
    }
    setChatLocalMsgStore(11, "", state.roomsObj);
}

// 需要更新会员信息 roomsMemberObj
// Need to update member information roomsMemberObj
const updateRoomsMemberObj = (state, commit, roomEle, roomId) => {
    let roomIdAndId = setRoomIdsId(roomId, 2); // 2为群聊
    let roomsMemberObjs = {...state.roomsMemberObj };
    let chatMembers = roomEle

    if (chatMembers.length > 0) {
        let chatMembersf = {};
        chatMembers.map((v) => {
            chatMembersf[v.id] = v;
            // 查询一次用户信息 -- 更新一次用户信息
            // Query user information once - update user information once
            commit("UPDATE_USERS_OBJ", v);
        });
        roomsMemberObjs[roomIdAndId] = chatMembersf;
    }
    commit("SET_MEMBEROBJ", roomsMemberObjs); // 匹配会员信息的关键
};

// 删除指定房间的 中间缓存信息-数据库信息
// Delete the intermediate cache information of the specified room-database information
export const delChatMsgCacheData = async(roomIdAndId) => {
    // rootState;


}


export default chat