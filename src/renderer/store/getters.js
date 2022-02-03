const getters = {
	sidebar: (state) => state.app.sidebar,
	device: (state) => state.app.device,
	token: (state) => state.user.token,
	appConfig: (state) => state.user.appConfig,
	avatar: (state) => state.user.avatar,
	name: (state) => state.user.name,
	eVal: (state) => state.user.eVal,
	roles: (state) => state.user.roles
	
};
export default getters
