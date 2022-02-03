import Dexie from 'dexie';
export class User extends Dexie {
    static getInstance(name) {
        return new User(name)
    }
    constructor(name) {
        // run the super constructor Dexie(databaseName) to create the IndexedDB
        // database.
        super(name || `User`);
        this.version(1).stores({
            chatInRooms: 'roomIdAndId,roomId,topStatus,msgDoNotDisturb,avatar,resend,isFirst,lastReadMsgId,isOffLineMsg,logo,msg,msgCount,nikeName,name,msgType,sendTime,msgId,unReadNum',
            chatLocalMsg: 'msgId,roomIdAndId,isTips,isMine,msg,msgType,isRead,isResending,replyType,sendTime,photo,nikeName,redStatus',
            NoticeMsg: 'msgId,isRead,isSysNotice,msg,msgType,sendTime,senderHead,senderId,senderName,quoteMsg,quoteMsgId,receiveType,receiverId,replyType,roomType,roomId',
            userList: 'id,teamId,topStatus,account,email,muteInt,msgDoNotDisturb,nikeName,photo,remark,role,roomIdAndId,sex,sign,status,uid',
            teamList: 'id,teamName,sort,isDel',
            BatchMsg: 'id,createTime,memberNum,message,msgType,receiverIds,receiverNames,userId,isDel',
            roomList: 'roomIdAndId,roomId,topStatus,adminNum,id,logo,msgDoNotDisturb,memberNum,name,roomChatId,roomNotice,status',
        });

        this.open()
    }
}


export const realDBName = () => {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let name
    if (userInfo) {
        name = `NewEra_${userInfo.id}`;
    } else {
        name = `NewEra_undefined`;
    }
    return name;
}

export default User;