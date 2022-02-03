import Vue from "vue";
import i18n from "../../i18n";
import { isObject } from "../tool";
import { entitiesToUtf16, isJSON } from "../tool";
const vue = new Vue({
	i18n,
});

let obj = {
	// BASE_URL: 'http://zzyht.pkbeta.com' + "/app/api/v2/goimfiles", //视频、图标拼接的地址; //test
	BASE_URL: window.location.origin + "/api/goimfiles", //视频、图标拼接的地址;

	DEFAULT_AVATAR: "", //require('@/assets/img/im/morentouxiang@2x.png'),
	REG_IMAGE: /(gif|jpg|jpeg|png|swf)$/,
	REG_VIDEO: /(mp4)$/,
	REG_VOICE: /(mp3)$/,

	IS_MINE: 1, // 1=自己（会员） 2=非自己（管理员、其他会员） // 1=self (member) 2=not self (administrator, other members)
	NO_MINE: 2,

	IS_ADMIN: 2, // 2=管理员 // 2=Administrator
	NO_ADMIN: 1, // 1=非管理员 // 1=Non-admin

	TYPE_CHAT: 1, //聊天室 //chatroom
	TYPE_PUBLIC: 2, //公群 //Public group
	TYPE_PRIVATE: 3, //私群 //Private group
	TYPE_MEMBER: 4, //会员 //member

	RECEIVE_TYPE_PRIVATE: 1, //receiveType 私聊 //receiveType private chat
	RECEIVE_TYPE_PUBLIC: 2, //receiveType 群聊 //receiveType group chat

	SEND_MSG_STATUS_LOADING: 1, //發送消息顯示loading //Send a message to display loading
	SEND_MSG_STATUS_SUCCESS: 2, //發送消息成功 //Send message successfully
	SEND_MSG_STATUS_FAIL: 3, //發送消息失敗 //Failed to send message

	// im消息类型 // im message type
	IM_MSG_TYPE_TEXT: 1, // 文本  // text
	IM_MSG_BUSINESS_CARD: 9, // 文本  // business card
	IM_MSG_TYPE_PICTURE: 2, // 图片  // Picture
	IM_MSG_TYPE_VIDEO: 3, // 视频  // video
	IM_MSG_TYPE_VOICE: 4, // 语音  // Voice
	IM_MSG_TYPE_REDBAG: 5, // 红包  // Red envelope
	IM_MSG_TYPE_QUOTE: 6, // 引用  // reference
	IM_MSG_TYPE_NOTIFICSTION: 7, // 通知  // Notice
	IM_MSG_TYPE_FILE: 8, // 文件  // file
	IM_MSG_TYPE_ANALOG: 9, // 机器人发送的消息  // The message sent by the robot

	// im通知消息类型 // IM notification message type
	//系统消息推送类型 //System message push type
	USER_RELATION_ADD: 1, //添加好友请求  系统通知 //Add friend request system notification
	USER_RELATION_ACCEPT: 2, //接受好友添加请求  系统通知 //Accept friend adding request system notification
	USER_RELATION_REFUSE: 3, //拒绝好友添加请求  系统通知 //Reject the request to add friends, system notification
	ROOM_RELATION_ADD: 4, //申请入群请求 系统通知取消了 功能取消
	ROOM_RELATION_ACCEPT: 5, //接受群添加请求 系统通知取消了 功能取消
	// ROOM_RELATION_REFUSE: 6, //拒绝群添加请求 系统通知取消了 功能取消
	ROOM_USER_KICK: 7, //被踢  系统通知  //Kicked system notification
	ROOM_ADMIN_ADD: 8, //被委任管理权 系统通知取消了  // Appointed to manage the system notice canceled
	ROOM_ADMIN_DEL: 9, //被取消管理权 系统通知取消了  //The management right has been cancelled. The system notification has been cancelled.
	ROOM_USER_ADD: 10, //被拉群通知  系统通知  //Notification of being pulled group System notification
	ROOM_USER_MUTE: 11, //被禁言  //Be banned
	ROOM_KICK_USER: 12, //踢人  //Kick people
	ROOM_ADD_ADMIN: 13, //委任管理权 系统通知取消了  // Appointment of management rights, system notification canceled
	ROOM_DEL_ADMIN: 14, //取消管理权 系统通知取消了  //Cancel the management right, the system notification has been cancelled
	ROOM_ADD_USER: 15, //拉进群通知  //Pull into group notification
	ROOM_ACCEPT_USER: 16, //同意入群通知 系统通知取消了  //Agree to join the group notification system notification canceled
	ROOM_INFO_UPDATE: 17, //群信息修改  //Group information modification
	ROOM_USER_OUT: 18, //退出房间通知  //Exit the room notification
	ROOM_MUTE_USER: 19, //禁言  //Mute
	ROOM_MUTE: 20, //房间禁言  //Room is muted
	ROOM_UNMUTE: 21, //房间解除禁言  //Unmute the room
	ROOM_DEL: 22, //群解散  //Group disband
	USER_UNMUTE: 23, //会员解除禁言  //Members lift the ban
	MESSAGE_READ_RECEIPT: 24, //留言已读回执  //Receipt of message read
	MESSAGE_BACK: 25, //消息回撤  //Message retracement
	ROOM_CHANGE_NAME: 26, // 房间名称修改  // Modify the room name
	ROOM_CHANGE_LOGO: 28, // 房间名称修改  // Modify the room logo
	//
};




let newObj = Object.assign({}, obj, {
    SEND_MSG_TYPE_ARRAY: [
        obj.IM_MSG_TYPE_TEXT,
        obj.IM_MSG_TYPE_PICTURE,
        obj.IM_MSG_TYPE_VIDEO,
        obj.IM_MSG_TYPE_VOICE,
		obj.IM_MSG_BUSINESS_CARD
    ],
})

export const handleNotice = (item) => {
	// let msgText = "";
	if(!item){
		return
	}
	item = isJSON(item) ? JSON.parse(item) : item;
	let type = item.noticeType;

	

	// let controUserAct = item.controUser&&item.controUser.account || '';
	// let pointUserAct = item.pointUser&&item.pointUser.account || '';
	// let roomName = item.room&&item.room.name || "";
	// let muteInt = item.muteInt || '';

	// let msgObj = typeof item.message === "string" ? JSON.parse(item.message) : item.message;
	let msgObj = isJSON(item.message) ? JSON.parse(item.message) : item.message;
	
	let msg;
	// let { nikeName='', roleName='', groupName='', managerName='', muteMin=0 } = msgObj;
	
	switch (type) {
		case obj.USER_RELATION_ADD:
			// msgText = '添加好友请求'
			// msgText = controUserAct + "申请成为您的好友";
			// msg = item.pointUser && item.pointUser.nikeName + "想添加你为好友";
			msg = vue.$t("userRelationAdd", [item.controUser.nikeName]);
			break;
		case obj.USER_RELATION_ACCEPT:
			// msgText = '接受好友添加请求'
			// msgText = `${controUserAct}接受了${pointUserAct}的好友添加请求`;
			// msg = msgObj.nikeName + "同意了你的好友申请";
			
			msg = vue.$t("userRelationAccept", [msgObj.nikeName]);
			break;
		case obj.USER_RELATION_REFUSE:
			// msgText = '拒绝好友添加请求'
			// msgText = `${controUserAct}拒绝了${pointUserAct}的好友添加请求`;
			// msg = msgObj.nikeName + "拒绝了你的好友申请";
			msg = vue.$t("userRelationRefuse", [msgObj.nikeName]);
			break;
		case obj.ROOM_RELATION_ADD:
		// 	// msgText = '申请入群请求'
			//msgText = `${controUserAct} 申请入群 ${roomName}`;
			msg = vue.$t("roomRelationAdd", [msgObj.nikeName, item.room.name]);
		break;
		case obj.ROOM_RELATION_ACCEPT:
		// 	// msgText = '接受群添加请求'
		// 	msgText = `${controUserAct}接受 群${roomName} 添加请求`;
		// 	break;
		// case obj.ROOM_RELATION_REFUSE:
		// 	// msgText = '拒绝群添加请求'
		// 	msgText = `${controUserAct}拒绝 群${roomName} 添加请求`;
		
			msg = vue.$t("roomRelationAccept", [item.controUser.nikeName, msgObj.nikeName, item.room.name]);

		break;
		case obj.ROOM_USER_KICK:
			// msgText = '被踢'
			// msgText = `${pointUserAct}被${controUserAct}踢出了${roomName}房间`;
			// msg = `你被${msgObj.roleName}${msgObj.nikeName}移出了${msgObj.groupName}群聊`;
			// msg = `你被${msgObj.roleName}${msgObj.nikeName}移出了${msgObj.groupName}群聊`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			msg = vue.$t("roomUserKick", [item.controUser.nikeName, item.room.name]);
			break;
		// case obj.ROOM_ADMIN_ADD:
		// 	// msgText = '被委任管理权'
		// 	msgText = `${pointUserAct}被${controUserAct}委任为${roomName}房间管理员`;
		// 	break;
		// case obj.ROOM_ADMIN_DEL:
		// 	// msgText = '被取消管理权'
		// 	msgText = `${pointUserAct}被${controUserAct}取消${roomName}房间的管理权`;
		// 	break;
		case obj.ROOM_USER_ADD:
			// msgText = '被拉群通知'
			// msgText = `${pointUserAct}被${controUserAct}拉到了群${roomName}`;
			// msg = `${msgObj.roleName}${msgObj.nikeName}邀请你加入了${msgObj.groupName}群聊`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			msg = vue.$t("roomUserAdd", [item.controUser.nikeName, item.room.name]);
			break;
		case obj.ROOM_KICK_USER:
			// msgText = '踢人'
			// msgText = `${controUserAct}把${pointUserAct}踢出了${roomName}房间`;
			// msg = `${msgObj.roleName}${msgObj.managerName}将${msgObj.nikeName}移出了群聊`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			//console.log('item1',item.pointUser.nikeName,item.room.name,item.controUser.nikeName)
			msg = vue.$t("roomKickUser", [item.controUser.nikeName, item.pointUser && item.pointUser.nikeName,item.room.name]);
			break;
		case obj.ROOM_ADD_ADMIN:
			// msgText = '委任管理权'
			// msgText = `${controUserAct}委任了${pointUserAct}为${roomName}房间的管理员`;
			// msg = `${msgObj.nikeName}被群主设置为管理员`;
			msg = vue.$t("roomAddAdmin",[item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_DEL_ADMIN:
			// msgText = '取消管理权'
			// msgText = `${controUserAct}取消了${pointUserAct}在${roomName}房间的管理员`;
			// msg = `${msgObj.nikeName}被群主解除了管理员权限`;
			msg = vue.$t("roomDelAdmin",[item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_ADD_USER:
			// msgText = '拉进群通知'
			// msgText = `${controUserAct}把${pointUserAct}拉进了${roomName}房间`;
			// msg = `${msgObj.managerName}邀请${msgObj.nikeName}加入了群聊`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			msg = vue.$t("roomAddUser",[item.controUser.nikeName, msgObj.nikeName]);
			break;
		case obj.ROOM_ACCEPT_USER:
		// 	// msgText = '接受群添加请求'
		// 	msgText = `${controUserAct}接受 群${roomName} 添加请求`;
		// 	break;
		// case obj.ROOM_RELATION_REFUSE:
		// 	// msgText = '拒绝群添加请求'
		// 	msgText = `${controUserAct}拒绝 群${roomName} 添加请求`;
			msg = vue.$t("roomRelationAccept", [item.controUser.nikeName, item.pointUser && item.pointUser.nikeName, item.room.name]);
		break;
		case obj.ROOM_INFO_UPDATE:
			// msgText = '群信息修改'
			// msgText = `${controUserAct}修改了群信息`;
			// msg = `${msgObj.nikeName}修改了群公告`;
			msg = vue.$t("roomInfoUpdate", [item.controUser && item.controUser.nikeName]);
			break;
		case obj.ROOM_USER_OUT:
			// msgText = '退出房间通知'
			// msgText = `${controUserAct}退出${roomName}房间`;
			// msg = `${msgObj.nikeName}离开了群聊`;
			msg = vue.$t("roomUserOut", [item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_MUTE_USER:
			// msgText = '禁言' 在房间禁言某人
			// msgText = `${controUserAct}在房间${roomName}禁言了${pointUserAct} ${muteInt}秒`;
			// msg = `${msgObj.nikeName}被${msgObj.roleName}${msgObj.managerName}禁言${msgObj.muteMin}分钟`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			msg = vue.$t("roomMuteUser", [item.pointUser && item.pointUser.nikeName, item.controUser.nikeName, msgObj.muteMin]);
			break;
		case obj.ROOM_MUTE:
			// msgText = '房间禁言' 禁言所有人
			// msgText = `房间${roomName}全体禁言 ${muteInt}秒`;
			// msg = `${item.pointUser && item.pointUser.nikeName}开启了全员禁言`;
			msg = vue.$t("roomMute",[item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_UNMUTE:
			// msgText = '房间解除禁言'
			// msgText = `${controUserAct}解除了房间${roomName} 所有人的禁言`;
			// msg = `${item.pointUser && item.pointUser.nikeName}关闭了全员禁言`;
			msg = vue.$t("roomUnmute", [item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_DEL:
			// msgText = '群解散'
			// msgText = `${controUserAct}解散了群${roomName}`;
			// msg = `${item.pointUser && item.pointUser.nikeName}解散了群聊${msgObj.groupName}`;
			msg = vue.$t("roomDel", [item.pointUser && item.pointUser.nikeName, item.room.name]);
			break;
		case obj.USER_UNMUTE:
			// msgText = '会员解除禁言'
			// msgText = `${pointUserAct}被${controUserAct} 解除禁言`;
			// msg = `${msgObj.nikeName}被${msgObj.roleName}${msgObj.managerName}解除禁言`;
			// msgObj.roleName = vue.filterRole(msgObj.roleName);
			msg = vue.$t("userUnmute", [item.pointUser && item.pointUser.nikeName, item.controUser.nikeName]);
			break;
		case obj.MESSAGE_BACK: // 25 消息撤回
			// msg = `${item.pointUser && item.pointUser.nikeName}撤回了一条消息`;
			msg = vue.$t("userMsgBack", [item.pointUser && item.pointUser.nikeName]);
			break;
		case obj.ROOM_CHANGE_NAME: // 26 修改群名称
			// msg = `${msgObj.nikeName}修改群名称为${msgObj.groupName}`;
			msg = vue.$t("roomChangeName", [item.pointUser && item.pointUser.nikeName, item.room.name]);
			break;
	}
	return msg;
}
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
export const handleMessage = (msg, type,item) => {
	
	var msgText = "";
	switch (type) {
		case obj.IM_MSG_TYPE_TEXT:
			var msgTextOb = typeof(msg)=='string' && JSON.parse(msg) || msg;
			msgText = entitiesToUtf16(msgTextOb.message);
			msgText = msgText.length<=15?msgText:(msgText.toString().slice(0, 15) + "...");
			break;
		case obj.IM_MSG_TYPE_PICTURE:
			msgText = vue.$t("picture");
			break;
		case obj.IM_MSG_BUSINESS_CARD:
			msgText = vue.$t("businessCard");
			break;
		case obj.IM_MSG_TYPE_VIDEO:
			msgText = vue.$t("video");
			break;
		case obj.IM_MSG_TYPE_VOICE:
			msgText = vue.$t("voice");
			break;
		case obj.IM_MSG_TYPE_REDBAG:
			msgText = vue.$t("redBag");
			break;
		case obj.IM_MSG_TYPE_NOTIFICSTION:
			msgText = vue.$t("tzxx");
			break;
		case obj.IM_MSG_TYPE_FILE:
			msgText = vue.$t("filez");
			break;
		case obj.IM_MSG_TYPE_QUOTE:
			
			if(item.replyType===obj.IM_MSG_TYPE_PICTURE){
				msgText = vue.$t("picture");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_VIDEO){
				msgText = vue.$t("video");
				break;
			}else if(item.replyType===obj.IM_MSG_BUSINESS_CARD){
				msgText = vue.$t("businessCard");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_VOICE){
				msgText = vue.$t("voice");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_REDBAG){
				msgText = vue.$t("redBag");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_TEXT){
				var msgTextOb = typeof(msg)=='string' && JSON.parse(msg) || msg;
				msgText = entitiesToUtf16(msgTextOb.message);
				msgText = msgText.length<=15?msgText:(msgText.toString().slice(0, 15) + "...");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_NOTIFICSTION){
				msgText = vue.$t("tzxx");
				break;
			}else if(item.replyType===obj.IM_MSG_TYPE_FILE){
				msgText = vue.$t("filez");
				break;
			}
			
	}
	return msgText;
};


export const translateHTML = (content) => {
	if (typeof content !== "string") {
		return content;
	}
    //支持的html标签
    /* var html = function (end) {
        return new RegExp("\\n*\\[" + (end || "") + "(code|pre|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*", "g");
    };
    content = (content || "")
        .replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#39;")
        .replace(/"/g, "&quot;") //XSS
        .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;">$1</a>$2') //转义@

        .replace(/\[([^\s\[\]]+?)\]/g, function (face) {
            //转义表情
            var alt = face.replace(/^/g, "");
            return alt;
        })
        .replace(html(), "<$1 $2>")
        .replace(html("/"), "</$1>"); //转移HTML代码 */
    return content;
}


export default newObj;