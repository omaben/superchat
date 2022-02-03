const rootConfig = {
	role: [
		{
			key: "成员",
			value: 1,
		},
		{
			key: "管理员",
			value: 2,
		},
		{
			key: "群主",
			value: 3,
		},
	],
	muteIntArr: [
		{
			key: "关闭",
			value: 0,
		},
		{
			key: "1分钟",
			value: 1,
		},
		{
			key: "5分钟",
			value: 5,
		},
		{
			key: "10分钟",
			value: 10,
		},
		{
			key: "无限",
			value: 99999999999999999999,
		},
	],
	onlineStatus: [
		{
			key: "全部",
			value: 0,
		},
		{
			key: "在线",
			value: 1,
		},
		{
			key: "离线",
			value: 2,
		},
	],
	readStatus: [
		{
			key: "已读",
			value: 1,
		},
		{
			key: "未读",
			value: 2,
		},
	],
	sexStatus: [
		{
			key: "男",
			value: 1,
		},
		{
			key: "女",
			value: 2,
		},
		{
			key: "未知",
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