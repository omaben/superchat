import { User, realDBName } from "./db";
export default class chatInRoomsDAO{
    
    static getInstance() {
        return new chatInRoomsDAO()
    }
    getUserInstance() {
		let name = realDBName();
        return User.getInstance(name);
    }
    get(option={}) {
        let order = option.order || "sendTime";
        return this.getUserInstance().chatInRooms.orderBy(order).reverse().sortBy('').then(result=>{
            let allChat = []
            let pinResult = result.filter(qry => qry.topStatus === 1)
            allChat = [... pinResult];
            let UnpinResult = result.filter(qry => qry.topStatus != 1)
            let newArray =  allChat.concat(UnpinResult);
            return newArray
        })
    }
    async add(item) {
        item.roomId = item.id
        item.avatar = item.nikeName || item.name || item.receiver
        this.getUserInstance().chatInRooms.delete(item.roomIdAndId)
        return this.getUserInstance().chatInRooms.add(
            {...item}
        );        
    }
    find(roomIdAndId) {
        return this.getUserInstance().chatInRooms.get(roomIdAndId)
    }
    update(item){
        item.roomId = item.id
        item.avatar = item.nikeName || item.name || item.receiver
        return this.getUserInstance().chatInRooms.update(item.roomIdAndId,{
            ...item
        })
    }
    delete(item){
        return this.getUserInstance().chatInRooms.delete(item.roomIdAndId)
    }
    deleteByID(roomIdAndId){
        return this.getUserInstance().chatInRooms.delete(roomIdAndId)
    }
    clearAll(){
        return this.getUserInstance().chatInRooms.clear()
    }
    
}
