import { User, realDBName } from "./db";
export default class chatLocalMsgDAO {
	static getInstance() {
		return new chatLocalMsgDAO();
	}
    getUserInstance() {
		let name = realDBName();
        return User.getInstance(name);
    }
	get(option={}) {
        let order = option.order || "msgId";
		return this.getUserInstance().chatLocalMsg
			.orderBy(order)
			.reverse()
			.toArray();
	}
	getLimit(roomIdAndId,limit) {
		return this.getUserInstance().chatLocalMsg.where({'roomIdAndId': roomIdAndId}).reverse().limit(limit)
	}
	getLimitTop(roomIdAndId,limit,msgIdItem) {
		return this.getUserInstance().chatLocalMsg.where({'roomIdAndId' :  roomIdAndId}).filter(({msgId}) => msgId < msgIdItem).reverse().limit(limit)
	}
	getLimitBottom(roomIdAndId,limit,msgIdItem) {
		return this.getUserInstance().chatLocalMsg.where({'roomIdAndId' :  roomIdAndId}).filter(({msgId}) => msgId > msgIdItem).limit(limit)
	}
	findByRoomIdAndId(roomIdAndId) {
        return this.getUserInstance().chatLocalMsg.where({'roomIdAndId': roomIdAndId})
    }
	find(msgId) {
        return this.getUserInstance().chatLocalMsg.get({'msgId': msgId})
    }
	add(item) {
		this.find(item.msgId).then((result)=>{
			if(!result){
				return this.getUserInstance().chatLocalMsg.add(
					{...item}
				);
			}else{
				//return this.getUserInstance().chatLocalMsg.update(item.msgId, { ...item });
			}
		})
		
	}
	update(item) {
		return this.getUserInstance().chatLocalMsg.update(item.msgId, { ...item });
	}
	delete(msgId) {
		return this.getUserInstance().chatLocalMsg.delete(msgId);
	}
	clearData() {
		return this.getUserInstance().chatLocalMsg.clear()
	}
	clearDataByRoom(roomIdAndId) {
		return this.getUserInstance().chatLocalMsg.where({'roomIdAndId': roomIdAndId}).delete();
	}
}
