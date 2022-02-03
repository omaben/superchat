export default {
    ADMIN_INFO: "/getUserInfo", // 用户详情 // The user details
    REGISTRY_USER: "/registry/user", // 注册 // registered
    LOGIN: "/login", // 登录 // The login
    LOGOUT: "/logout", // 登出 // logout
    PHONE_CODE: "/phoneCode", // 获取短信验证码 // Get the SMS verification code
    PHONE_CODE_VER: "/phoneCode/ver", // 短信验证码验证 // SMS verification code verification
    CAPTCHA_PUZZLE_VER: "/captcha/puzzle/ver", // 图形验证码验证 // Graphic CAPTCHA verification
    CAPTCHA_PUZZLE: "/captcha/puzzle", // 获取图形验证码 // Gets the graphic CAPTCHA
    LOGIN_BY_CODE: "/loginByCode", // 短信验证码登录 // SMS verification code login
    QUERY_USER_BY_ACCOUNT: "/queryUserByAccount", // 根据账号查询用户 // Search users by account number
    MODIFY_USER: "/ModifyUser", // 用户资料修改 // Modification of user data
    QUERY_USER_BYID: "/queryUserById", // 根据id查询用户信息 // Query user information by ID
    SET_FRIEND_NAME: "/setFriendName", // 修改好友备注昵称 // Modify friends' comments nicknames
    // QUERY_USERS_BY_IDS: "/queryUsersByIds", // 根据ids查询多个用户 废弃
    UPDATE_PASSWORD: "/updatePassword", // 修改密码 //updatePassword

    // 好友关系接口 // Friend Relationship Interface
    ADD_USER_RELATION: "/addUserRelation", // 申请添加好友 // Request to add friends
    USER_ACCEPT_OR_REFUSE: "/userAcceptOrRefuse", //好友申请审核 // Friend Request Review
    DELTE_USER_REALATION: "/delteUserRealation", //删除好友 // Remove buddy
    FIND_ALL_USER_RELATION: "/findAllUserRelation", //查询本人所有好友关系 // Query all my friends
    GET_All_Team: "/getAllTeam", // get all team friends
    EDIT_USER_TEAM: "/editUserTeam", // update all team friends
    DELETE_USER_TEAM: "/delUserTeam", // delete team friends
    UPDATE_TEAM: "/updateTeam", // assign friend to special team friends
    OUT_ROOM_REALATION: "/outRoomRealation", //退出房间 // Out of the room
    ROOM_ACCEPT_OR_REFUSE: "/roomAcceptOrRefuse", //退出房间 //  room request review
    FIND_ALL_ROOM_RELATION: "/findAllRoomRelation", //查询用户全部群 // Query all groups of users
    FIND_USERS_BY_ROOM_ID: "/findUsersByRoomId", //查询群成员  //"role":1成员,2管理员,3群主 // "status":1申请中,2申请通过
    DEL_ROOM_ADMIN: "/delRoomAdmin", //解除群管理员权限 // Remove group administrator privileges
    ADD_ROOM_ADMIN: "/addRoomAdmin", //添加群管理员 // Add a group administrator
    KICK_ROOM: "/kickRoom", //踢群 // Play group
    INVITE_ROOM: "/inviteRoom", //邀请入群 // Invited into the group of
    QUERY_ROOMS_BY_IDS: "/queryRoomsByIds", //根据ids查询多个群信息 // Query multiple group information based on IDS
    MUTE_USER: "/muteUser", //群内用户禁言 // Users in the group are forbidden to speak
    UN_MUTE_USER: "/unMuteUser", //解除用户禁言 // Unban users
    // 房间接口 群聊接口 // Group chat interface
    ADD_ROOM: "/addRoom", //创建聊天群 // Create a chat group
    UPDATE_ROOM: "/updateRoom", //修改聊天群 // Modify chat group
    UPDATE_ROOM_STATUS: "/updateRoomStatus", //禁言与解除禁言 // Gag and gag lifting
    DELETE_ROOM: "/deleteRoom", //解散群 // The dissolution of
    // 消息接口 // Message interface
    IM_KEY: "/im/conn", //im连接信息 // IM connection information
    IM_GET_OFFLINE_MSG: "/im/getOfflineMsg", //会员离线消息查询 // Member offline message lookup
    GOIMFILES_UPLOAD: "/goimfiles/upload", //文件上传 // File upload
    SEND_MSG: "/im/sendMessage", //发送消息 // Send a message
    IM_MSG_RECEIPT: "/im/msgReceipt", //消息回执 // Message receipt
    IM_MSG_READ_INFO: "/im/msgReadInfo", //消息已读详情 // Message read details
    IM_BACK_MESSAGE: "/im/backMessage", //消息撤回 // Message to withdraw
    IM_RED_MSG: "/im/redMsg", //发送红包 // Sending a red envelope
    IM_GRAB_RED: "/im/grabRed", //抢红包 // Grab a red envelope
    IM_RED_INFO: "/im/redInfo", //红包详情 // Details of a red envelope
    GET_USER_SESSION_LIST: "/getUserSessionList", // 会话列表查询 // Session list query
    IMGET_OFFLINE_MSG_BY_ID: "/im/getOfflineMsgById", // 群密聊离线消息 // Group chat offline messages
    DEL_USER_SESSION_LIST: "/delUserSessionList", // 删除用户会话列表 // Delete the list of user sessions
    PIN_USER_SESSION_LIST: "/topMessage", // 删除用户会话列表 // top the list of user sessions

    DEL_MSG: "/im/delMessage",

    // 安全问题接口 // Security problem interface
    SAFE_QUERY_QUESTION: "/safe/queryQuestion", //查询全部密码安全问题 // Query all password security issues
    SAFE_ADD_QUESTION: "/safe/addQuestion", //添加用户安全问题 // Add user security issues
    SAFE_GET_QUESTION: "/safe/getQuestion", //查询用户安全问题 // Query user security issues
    SAFE_CHECK_ANSWER: "/safe/checkAnswer", //验证安全问题答案 // Verify answers to security questions
    SAFE_UPDATE_QUESTION: "/safe/updateQuestion", //修改安全问题 // Modify security issues
    ACCOUNT_SAFE_QUESTION: "/account/safeQuestion", //忘记密码，根据账号获取安全问题 // Forget the password, according to the account to get security questions
    ACCOUNT_CHECK_ANSWER: "/account/checkAnswer", //忘记密码,验证安全问题答案 // Forgetting passwords and verifying answers to security questions
    ACCOUNT_UPDATE_PASSWORD: "/account/updatePassword", // 通过安全问题,找回密码 // Passing the security question to retrieve the password

    // 举报接口 // Report interface
    COMPLAIN: "/complain", //添加举报 // Add to report
    // 分享接口 // Sharing interface
    SHARE: "/share", //分享接口 // Sharing interface
    // 关于App接口 // About APP Interface
    CHECK_APP_VERSION: "/checkAppVersion", //检查更新 // Check the update
    FEEDBACK: "/feedback", //意见反馈 // feedback
    // 自定义表情 // Custom emoticons
    PICTURE_COL_LIST: "/pictureCollectionList", //分页查询自定义表情 // Paging query for custom expressions
    PICTURE_COL: "/pictureCollection", //添加自定义表情 // Add custom emoticons
    DEL_PICTURE_COL: "/delPictureCollection", //删除自定义表情 // Delete custom emoticons

    // /kickRoom //踢群
    // /kickRoom //踢群

    ACCOUNT_FEEDBACK: "/account/feedback", //忘记安全密码 // forget security Password
    ACCOUNT_SET_SHOW: "/accountSetShow", //检查用户帐号是否可见 // check the user account is visible or not
    CHECK_REGISTER: "/checkRegister",
    ACCOUNT_SHOW: "/getAccountShow",
    DO_NOT_DISTRUB: "/msgDisturbSet",
    UPDATE_ROOM_SETTING: "/updateRoomSetting",
    CHANGE_OWNER: "/changeOwner",
    BANNED_LIST: "/bannedList",
    USER_BLACK_LIST: "/userBlackList",
    ADD_BLACK_LIST: "/addBlackList",
    DEL_BLACK_LIST: "/delBlackList",
    GET_ALL_DEVICE: "/getAllDevice",
    LOGOUT_DEVICE: "/logoutDevice",
    LOGOUT_OTHER_DEVICE: "/logoutOtherDevice",
    DISCOVERY: "/discovery",
    BATCH_SEND_MESSAGE: "/im/batchSendMessage",
    BATCH_MESSAGE: "/batchMessage",
    DEL_BATCH_MESSAGE: "/delBatchMessage",
    CLEAR_BATCH_MESSAGE: "/clearBatchMessage",
    APP_CONFIG: "/appConfig",
    RED_MSG: "im/redMsg",
    RED_INFO: "im/redInfo",
    RED_GRAB: "im/grabRed",
    CASH_RECORD: "/cashRecord",
    GET_USER_DEVICE: "/getUserDevice",
};