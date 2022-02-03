const rootConfig = {
	role: [
		{
			key: "Member",
			value: 1,
		},
		{
			key: "Admin",
			value: 2,
		},
		{
			key: "Owner",
			value: 3,
		},
	],
	muteIntArr: [
		{
			key: "Close",
			value: 0,
		},
		{
			key: "1 Minute",
			value: 1,
		},
		{
			key: "5 Minutes",
			value: 5,
		},
		{
			key: "10 Minutes",
			value: 10,
		},
		{
			key: "Unlimited",
			value: 99999999999999999999,
		},
	],
	onlineStatus: [
		{
			key: "All",
			value: 0,
		},
		{
			key: "Online",
			value: 1,
		},
		{
			key: "Offline",
			value: 2,
		},
	],
	readStatus: [
		{
			key: "Readed",
			value: 1,
		},
		{
			key: "Unread",
			value: 2,
		},
	],
	sexStatus: [
		{
			key: "Male",
			value: 1,
		},
		{
			key: "Female",
			value: 2,
		},
		{
			key: "UnKnow",
			value: 3,
		},
	],
	langArr: [
		{
			key: "中文",
			value: "zh",
		},
		// {
		// 	key: "繁體",
		// 	value: "tc",
		// },
		{
			key: "English",
			value: "en",
		},
		// {
		// 	key: "Tiếng Việt",
		// 	value: "vi",
		// },
		// {
		// 	key: "ไทย",
		// 	value: "th",
		// },
	],
};


export default rootConfig;