import { User, realDBName } from "./db";
export default class teamListDAO {
	static getInstance() {
		return new teamListDAO();
	}
	getUserInstance() {
		let name = realDBName();
		return User.getInstance(name);
	}
	newInfo() {
		return this.getUserInstance().teamList;
	}
	get(option = {}) {
		let order = option.order || "id";
		return this.newInfo()
			.orderBy(order)
			.reverse()
			.toArray();
	}
	add(item) {
		// isDel 1: be del 2：not Del
		// To save all user data
		return this.newInfo().add({ ...item, isDel: 2 });
	}
	find(id) {
		return this.newInfo().get(id);
	}
	update(item) {
		return this.newInfo().update(item.id, {
			...item,
		});
	}
	delete(item) {
		return this.newInfo().delete(item.id);
	}
	clearAll() {
		return this.newInfo().clear();
	}
}

export const teamListInstance = () => {
	let getInstance = teamListDAO.getInstance();
	let getListIns = () => {
		getInstance
			.get()
			.then((result) => {
			})
			.catch((e) => {
				console.log("err_or: ", e);
			});
	};
	let findInstance = async (id) => {
		await getInstance
			.get(id)
			.then((result) => {
				getListIns();
			})
			.catch((e) => {
				console.log("err_or: ", e);
			});
	};
	let editInstance = async (v) => {
		await getInstance.find(v.id).then((result) => {
			
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
			});
	};
	return {
		getInstance,
		editInstance,
		getListIns,
		delListIns,
		findInstance,
	};
};
