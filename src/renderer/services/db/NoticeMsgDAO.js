import { User, realDBName } from "./db";
export default class NoticeMsgDAO{
    static getInstance() {
        return new NoticeMsgDAO()
    }
    getUserInstance() {
		let name = realDBName();
        return User.getInstance(name);
    }
    get(option={}) {
        let order = option.order || 'sendTime';

        return this.getUserInstance().NoticeMsg.orderBy(order).reverse().toArray();
    }
    getLast(){
        return this.getUserInstance().NoticeMsg.orderBy('sendTime').last()
    }
    add(item) {
        return this.getUserInstance().NoticeMsg.add(
			{...item}
		);
    }
    find(msgId) {
        return this.getUserInstance().NoticeMsg.get(msgId)
    }
    update(item){
        return this.getUserInstance().NoticeMsg.update(item.msgId,{
            ...item
        })
    }
    delete(item){
        return this.getUserInstance().NoticeMsg.delete(item.msgId)
    }
    clearAll(){
        return this.getUserInstance().NoticeMsg.clear()
    }
    
}
