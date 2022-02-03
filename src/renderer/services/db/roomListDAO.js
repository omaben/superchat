import { User, realDBName } from "./db";
export default class roomListDao{
    static getInstance() {
        return new roomListDao()
    }
    getUserInstance() {
		let name = realDBName();
        return User.getInstance(name);
    }
    newInfo(){
        return this.getUserInstance().roomList;
    }
    get(option={}) {
        let order = option.order || 'roomIdAndId';
        return this.newInfo().orderBy(order).reverse().toArray();
    }
    add(item) {
        return this.newInfo().add(
			{...item, isDel:2}
		);
    }
    find(roomIdAndId) {
        return this.newInfo().get({'roomIdAndId': roomIdAndId})
    }
    findByRoomId(id) {
        if(id){
         return this.newInfo().get({'id': id})
        }
    }
    update(item){
        return this.newInfo().update(item.roomIdAndId,{
            ...item
        })
    }
    delete(item){
        return this.newInfo().delete(item.roomIdAndId)
    }
    clearAll(){
        return this.newInfo().clear()
    }
    
}



export const roomListInstance = () => {
	let getInstance = roomListDao.getInstance();
    let getListIns = () => {
        getInstance
        .get()
        .then((result) => {
        })
        .catch((e) => {
            console.log("err_or: ", e);
        });
    }

    let editInstance = async(v) => {
        await getInstance.find(v.roomIdAndId).then((result) => {
			if (result) {
				getInstance
					.update(v)
					.then(() => {
						getListIns();
					})
					.catch((e) => {
						console.log("edit_err: ", e);
					});
			} else {

				getInstance
					.add(v)
					.then(() => {
						getListIns();
					})
					.catch((e) => {
						console.log("edit_err: ", e);
					});
			}
		});
        
    };

    let delListIns = async (v) => {
        await getInstance
			.update({ ...v, isDel: 1 })
			.then(() => {
				getListIns();
			})
			.catch((e) => {
				console.log("del_err: ", e);
			});;
	};
	return {
		getInstance,
		editInstance,
		getListIns,
		delListIns,
	};
};
