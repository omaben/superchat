// 消息组系列处理
import { imGetOfflineMsg, getUserSessionList, getOfflineMsgById } from '@/services'
import MSG_TYPE, { translateHTML } from "@/services/im/constant";
import { combineMsg, setRoomIdsId, qckeysPro,qckeys } from "@/services/tool";
import Bus from "@/services/bus";
const { remote, ipcRenderer } = require('electron')

import {
	userStore,
	setUserStore,
	getUserStore,
	getChatLocalMsgStore,
	setChatLocalMsgStore,
	hasChatLocalMsgStore,
	delChatLocalMsgStore,
} from "tool/storage";
import { chatInRoomsDAO , NoticeMsgDAO } from "@/services/db";
let getDataBase = async () => {
	let noticeMsg = await NoticeMsgDAO.getInstance().get();
	return {
		noticeMsg,
	};
}

 
let offLine_obj = {}
const group = {
	state: {
		groupInfo: {
			id: -1,
		},
		// 离线消息是只有 好友或者自己加入的群才会有的推送消息
		// offLineMsg: {}, //读了离线消息之后 还要分层清空
		// notification message
		noticeMsg: getDataBase().noticeMsg || [], // 通知消息
		// The total number of unread messages in the chat room
		
		unReadNum: getChatLocalMsgStore(4) || 0, // 正在聊天房间的消息未读总数
		// custom emoji
		customFace: getChatLocalMsgStore(6) || {}, // 自定义表情
	},
	getters: {
		
		groupInfo: (state) => state.groupInfo,
		// offLineMsg: (state) => state.offLineMsg,
		noticeMsg: (state) => state.noticeMsg,
		unReadNum: (state) => state.unReadNum,
		customFace: (state) => state.customFace,
	},

	mutations: {
		SET_CHATINFO: (state, info) => {
			state.groupInfo = info;
		},
		CLEAR_NOTICEMSG: (state)=> {
			let getInstance = NoticeMsgDAO.getInstance();
			state.noticeMsg = [];
			getInstance.clearAll()			
		},
		SET_NOTICEMSG: (state, noticeMsg) => {
			let getInstance = NoticeMsgDAO.getInstance();
			state.noticeMsg = noticeMsg;
			noticeMsg.forEach(item=>{
				getInstance.update(item)
			})

		},
		UPDATE_NOTICEMSG: (state, noticeMsg) => {
			// 检查已读，未读
		},
		DEL_NOTICEMSG: (state, idx) => {
			let getInstance = NoticeMsgDAO.getInstance();
			getInstance.delete(state.noticeMsg[idx])
			state.noticeMsg.splice(idx, 1);
		},
		ADD_NOTICEMSG: (state, noticeMsg) => {
			// receiveType:0 通知
			let getInstance = NoticeMsgDAO.getInstance();
			if (noticeMsg.roomId === 0) {
				noticeMsg.isSysNotice = true; // 系统通知 // system notification
				noticeMsg.isRead = false; // 新建已读未读字段 // New read and unread fields
				if (state.noticeMsg instanceof Array) {
					getInstance.find(noticeMsg.msgId).then(res => {
						if(!res){
							getInstance.add(noticeMsg).then(()=>{
								getInstance.get().then(res=>{
									state.noticeMsg = res
								})
							})
							
							
							
						}else{
							/* getInstance.update(noticeMsg).then(()=>{
								getInstance.get().then(res=>{
									state.noticeMsg = res
								})
							}) */
							getInstance.get().then(res=>{
								state.noticeMsg = res
							})
						}

					})
					
							
					

				}
			}
		},
		SET_UNREAD_NUM: (state, num) => {
			state.unReadNum = num;
			setChatLocalMsgStore(4, "", state.unReadNum);
		},
		ADD_UNREAD_NUM: (state, num) => {
			state.unReadNum = num;
			setChatLocalMsgStore(4, "", state.unReadNum);
		},
		SET_CUSTOM_FACE: (state, customFaces) => {
			state.customFace = customFaces;
			setChatLocalMsgStore(6, "", state.customFace);
		},
	},

	actions: {
		SetGroupInfo: ({ commit }, item) => {
			commit("SET_CHATINFO", item);
		},
		// 会员离线消息查询
		// 会员读了那一条，定向删除哪一条。需要做缓存
		// Member offline message query
		// Which one is read by the member, and which one is targeted to be deleted. Need to do caching
		GetOffLineMsg({ state, commit, rootState, dispatch }) {
			return new Promise((resolve, reject) => {
				imGetOfflineMsg().then((res) => {
					if (res.success) {
						let offLineMsg = res.data.data || [];
						offLineMsg.map((v) => {
							dealOffLineMsg(v, dispatch, rootState);
						});
						// 循环渲染完成之后 // After the loop rendering is complete
						offLine_obj = {};
						resolve();
					} else {
						reject(res.message);
					}
				});
			});
		},
		// 通知消息设置 // Notification message settings
		SetNoticeMsg({ state, commit }, noticeMsgs) {
			let msg = noticeMsgs.map((v) => {
				if (v.roomId === 0) {
					v.isSysNotice = true; // 系统通知 // system notification
				} else {
					v.isNotice = true; // 普通通知消息 // general notification message
				}
				return v;
			});
			commit("SET_NOTICEMSG", msg);
			// 添加到不同账号下面
		},
		AddNoticeMsg({ state, commit, dispatch }, noticeMsg) {
			commit("ADD_NOTICEMSG", noticeMsg);
		},

		UpdateNoticemsg({ state }, noticeMsg) {
			commit("UPDATE_NOTICEMSG", noticeMsg);
		},
		
		
		async GetUserSessionList({ state, commit, rootState, dispatch }) {
			
			return new Promise((resolve, reject) => {
				getUserSessionList().then((res) => {
					if (res && res.success) {
						let data = res.data;
						
						let sessionList = data.sessionList || [];
						/* let sysNoticeList = data.noticeList || [];
						console.log(sysNoticeList,'sysNoticeList')
						sysNoticeList.forEach((item,index) => {
							 dealNotice(item)
						}) */
						
						let allCount=0
						sessionList.forEach((item) => {
							item.roomType = item.receiverType;
							
							// item.receiverId 会话列表 用户id 房间id
							if (
								item.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE
							) {
								item.id = item.receiverId;
							} else if (
								item.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC
							) {	
								item.roomId = item.receiverId;
							}
							item.id = item.receiverId;
							item.roomId = item.receiverId;
							item.roomIdAndId = setRoomIdsId(
								item.receiverId,
								item.roomType
							);
							
							let msg = decrypt(item.msg);
							
							if(msg !='')
							{
								var msgTextOb =(typeof msg == "string" && JSON.parse(msg)) || msg;
								item.msg = msgTextOb.msg;
								item.msgType = msgTextOb.msgType;
								item.sendTime = msgTextOb.sendTime;
								
								item.msgId = item.msgId;
							}
							
							
							
							// Init chatInRoomsPro[roomIdAndId][isFirst]
							let getInstance = chatInRoomsDAO.getInstance();
							getInstance.find(item.roomIdAndId).then((result) => {
								if (result) {
										if(!result.unReadNum){
											item.unReadNum=0
										}
										else{
											item.unReadNum=result.unReadNum
										}
										if(item.msgCount>0 && item.msgId!=result.msgId){
											let msgCount=item.msgCount-result.msgCount
											item.unReadNum+=msgCount
										}
										item.isFirst=true
										
										getInstance.update(item).then(()=>{
											allCount += item.unReadNum
											getInstance
												.get()
												.then((result) => {
													state.chatInRooms = result;
													commit("SET_UNREAD_NUM", allCount);
											})
											.catch((e) => {
												console.log("err_or: ", e);
											});
										});
								}
							})
							dispatch("AddChatInRooms", item);
						});
						

						
						resolve();
					} else {
						let getInstance = chatInRoomsDAO.getInstance();
						getInstance
						.get()
						.then((result) => {
							dispatch("SetChatInRooms", result);
							
							//console.log(state.chatInRooms,'resultresult')
							
						})
						//reject(res.message);
					}
				});
			});
		},
		
		GetOfflineMsgById({ state, commit, rootState, dispatch }, chatInRoom) {
			let id;
			if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PRIVATE) {
				id = chatInRoom.id;
			} else if (chatInRoom.roomType == MSG_TYPE.RECEIVE_TYPE_PUBLIC) {
				id = chatInRoom.roomId;
			}
			let post = {
				id: id,
				receiveType: chatInRoom.roomType,
			};
			return new Promise((resolve, reject) => {
				getOfflineMsgById(post).then((res) => {
					if (res.success) {
						resolve(res.data);
					} else {
						reject(res);
					}
				});
			});
		},
		GetOfflineNoticeMsgById({ state, commit, rootState, dispatch }, notice) {
			
			let post = {
				id: notice.id,
				receiveType: 3,
			};
			return new Promise((resolve, reject) => {
				getOfflineMsgById(post).then((res) => {
					if (res.success) {
						
						resolve(res.data);
						if(res.data){
							let dataNotice = res.data
							if(dataNotice.count>0){
								dataNotice.data.forEach(item=>{
									dealNotice(item)
								})
							}
						}
					} else {
						reject(res);
					}
				});
			});
		},
	},
};

const dealOffLineMsg = (data, dispatch, rootState) => {
	// data.receiveType
	// 标记当前聊天房间 receiveType:0 通知
	let offLineData = {
		...data,
		roomType: data.receiveType,
		isOffLineMsg: true,
	};
	if (
		data.receiveType === MSG_TYPE.RECEIVE_TYPE_PUBLIC ||
		data.receiveType === MSG_TYPE.RECEIVE_TYPE_PRIVATE
	) {

		if(offLineData.msgType == MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION){
			let item = {...offLineData}
			let msg_json = typeof item.msg === "string" ? JSON.parse(item.msg) : item.msg;
			if(msg_json.noticeType === MSG_TYPE.MESSAGE_READ_RECEIPT){
				return
			}
		}				
	}
	// 通知消息
	// notification message
	if (offLineData.msgType == MSG_TYPE.IM_MSG_TYPE_NOTIFICSTION) {
		dealNotice(offLineData, rootState);
	}

};


const dealNotice = (offLineData, rootState) => {
	Bus.$emit("dealNotice", offLineData);
};
export const decrypt = (data) => {
	var crypto = require('crypto');
	const keys = 'aaaaaaaaaaaaaaaa';
 	const vi = '';
	let key = keys;
	if (!data) {
		return "";
	}
	let iv = vi || keys;
	var clearEncoding = 'utf8';
	var cipherEncoding = 'base64';
	var cipherChunks = [];
	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
	decipher.setAutoPadding(true);
	cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
	cipherChunks.push(decipher.final(clearEncoding));
	return cipherChunks.join('');
}





export default group;


