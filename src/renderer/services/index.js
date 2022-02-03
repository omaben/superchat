import axios from './ajax';
import api from './api';

function getUserInfo() {
    return axios.post(api.ADMIN_INFO).then(res => {
        return res.data
    })
}


function login(post) {
    return axios.post(api.LOGIN, post).then(res => {
        console.log(res, 'login')
        return res.data
    })
}

function logout(post) {
    return axios.post(api.LOGOUT, post).then(res => {
        return res.data
    })
}

function registerUser(post) {
    return axios.post(api.REGISTRY_USER, post).then(res => {
        return res.data
    })
}

function phoneCode(post) {
    return axios.post(api.PHONE_CODE, post).then(res => {
        return res.data
    })
}

function phoneCodeVer(post) {
    return axios.post(api.PHONE_CODE_VER, post).then(res => {
        return res.data
    })
}


function captchaPuzzleVer(post) {
    return axios.post(api.CAPTCHA_PUZZLE_VER, post).then(res => {
        return res.data
    })
}

function captchaPuzzle(post) {
    return axios.post(api.CAPTCHA_PUZZLE, post).then(res => {
        return res.data
    })
}

function loginByCode(post) {
    return axios.post(api.LOGIN_BY_CODE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function queryUserByAccount(post) {
    return axios.post(api.QUERY_USER_BY_ACCOUNT, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function modifyUser(post) {
    return axios.post(api.MODIFY_USER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function queryUserByid(post) {
    return axios.post(api.QUERY_USER_BYID, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function setFriendName(post) {
    return axios.post(api.SET_FRIEND_NAME, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function updatePassword(post) {
    return axios.post(api.UPDATE_PASSWORD, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}



function getElseMail(url) {
    // "/GetPhoneCode?"
    return axios.get(url).then(res => {
        return res.data || res
    })
}

// 用户关系接口 start
function addUserRelation(post) {
    return axios.post(api.ADD_USER_RELATION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function userAcceptOrRefuse(post) {
    return axios.post(api.USER_ACCEPT_OR_REFUSE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function roomAcceptOrRefuse(post) {
    return axios.post(api.ROOM_ACCEPT_OR_REFUSE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delteUserRealation(post) {
    return axios.post(api.DELTE_USER_REALATION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function findAllUserRelation(post) {
    return axios.post(api.FIND_ALL_USER_RELATION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function getAllTeam(post) {
    return axios.post(api.GET_All_Team, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function editUserTeam(post) {
    return axios.post(api.EDIT_USER_TEAM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delUserTeam(post) {
    return axios.post(api.DELETE_USER_TEAM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function updateTeam(post) {
    return axios.post(api.UPDATE_TEAM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function outRoomRealation(post) {
    return axios.post(api.OUT_ROOM_REALATION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function findAllRoomRelation(post) {
    return axios.post(api.FIND_ALL_ROOM_RELATION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function findUsersByRoomId(post) {
    return axios.post(api.FIND_USERS_BY_ROOM_ID, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delRoomAdmin(post) {
    return axios.post(api.DEL_ROOM_ADMIN, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function addRoomAdmin(post) {
    return axios.post(api.ADD_ROOM_ADMIN, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function kickRoom(post) {
    return axios.post(api.KICK_ROOM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function inviteRoom(post) {
    return axios.post(api.INVITE_ROOM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function queryRoomsByIds(post) {
    return axios.post(api.QUERY_ROOMS_BY_IDS, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function muteUser(post) {
    return axios.post(api.MUTE_USER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function unMuteUser(post) {
    return axios.post(api.UN_MUTE_USER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

// 用户关系接口 end

// 房间接口 群聊接口 start
function addRoom(post) {
    return axios.post(api.ADD_ROOM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function updateRoom(post) {
    return axios.post(api.UPDATE_ROOM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function updateRoomStatus(post) {
    return axios.post(api.UPDATE_ROOM_STATUS, post).then((res) => {

        if (res) {
            return res.data;
        }
    });
}

function deleteRoom(post) {
    return axios.post(api.DELETE_ROOM, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}
// 房间接口 群聊接口 end

// 消息接口 start
function imGetOfflineMsg(post) {
    return axios.post(api.IM_GET_OFFLINE_MSG, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function goimfilesUpload(post) {
    return axios.form(api.GOIMFILES_UPLOAD, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function sendMsg(post) {
    return axios.post(api.SEND_MSG, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imMsgReceipt(post) {
    return axios.post(api.IM_MSG_RECEIPT, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imMsgReadInfo(post) {
    return axios.post(api.IM_MSG_READ_INFO, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imBackMessage(post) {
    return axios.post(api.IM_BACK_MESSAGE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imRedMsg(post) {
    return axios.post(api.IM_RED_MSG, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imGrabRed(post) {
    return axios.post(api.IM_GRAB_RED, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function imRedInfo(post) {
    return axios.post(api.RED_INFO, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function getUserSessionList(post) {

    return axios.post(api.GET_USER_SESSION_LIST, post).then((res) => {
        /* 		console.log(res,'jhdshjdshj')
         */
        if (res) {
            return res.data;
        }
    });
}

function getOfflineMsgById(post) {
    return axios.post(api.IMGET_OFFLINE_MSG_BY_ID, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delUserSessionList(post) {
    return axios.post(api.DEL_USER_SESSION_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function topMessage(post) {
    return axios.post(api.PIN_USER_SESSION_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

// 消息接口 end

// 安全问题接口 start
function safeQueryQuestion(post) {
    return axios.post(api.SAFE_QUERY_QUESTION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function safeAddQuestion(post) {
    return axios.post(api.SAFE_ADD_QUESTION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function safeGetQuestion(post) {
    return axios.post(api.SAFE_GET_QUESTION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function safeCheckAnswer(post) {
    return axios.post(api.SAFE_CHECK_ANSWER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function safeUpdateQuestion(post) {
    return axios.post(api.SAFE_UPDATE_QUESTION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function accountSafeQuestion(post) {
    return axios.post(api.ACCOUNT_SAFE_QUESTION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function accountCheckAnswer(post) {
    return axios.post(api.ACCOUNT_CHECK_ANSWER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function actUpdPass(post) {
    return axios.post(api.ACCOUNT_UPDATE_PASSWORD, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}
// 安全问题接口 end

// else start
function complain(post) {
    return axios.post(api.COMPLAIN, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function share(post) {
    let url = api.SHARE + "?";
    Object.keys(post).map((key) => {
        url += key + "=" + post[key] + "&";
    });
    url = url.substring(url.length - 1, 1);
    return url;
    // return axios.get(url).then((res) => {
    // 	return res.data || res;
    // });
}

function checkAppVersion(post) {
    return axios.post(api.CHECK_APP_VERSION, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function feedback(post) {
    return axios.post(api.FEEDBACK, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}
// else end

// 自定义表情 start
function pictureColList(post) {
    return axios.post(api.PICTURE_COL_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function pictureCol(post) {
    return axios.post(api.PICTURE_COL, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delPictureCol(post) {
    return axios.post(api.DEL_PICTURE_COL, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function accountFeedback(post) {
    return axios.post(api.ACCOUNT_FEEDBACK, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function accountSetShow(post) {
    return axios.post(api.ACCOUNT_SET_SHOW, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function checkRegister(post) {
    return axios.post(api.CHECK_REGISTER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function getAccountShow(post) {
    return axios.post(api.ACCOUNT_SHOW, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function doNotDistrub(post) {
    return axios.post(api.DO_NOT_DISTRUB, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function updateRoomSetting(post) {
    return axios.post(api.UPDATE_ROOM_SETTING, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function changeOwner(post) {
    return axios.post(api.CHANGE_OWNER, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function bannedList(post) {
    return axios.post(api.BANNED_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function userBlackList(post) {
    return axios.post(api.USER_BLACK_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function addBlackList(post) {
    return axios.post(api.ADD_BLACK_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delBlackList(post) {
    return axios.post(api.DEL_BLACK_LIST, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function getAllDevice(post) {
    return axios.post(api.GET_ALL_DEVICE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function logoutDevice(post) {
    return axios.post(api.LOGOUT_DEVICE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function logoutOtherDevice(post) {
    return axios.post(api.LOGOUT_OTHER_DEVICE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function discovery(post) {
    return axios.post(api.DISCOVERY, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function batchSendMessage(post) {
    return axios.post(api.BATCH_SEND_MESSAGE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function redMsg(post) {
    return axios.post(api.RED_MSG, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function batchMessage(post) {
    return axios.post(api.BATCH_MESSAGE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function delBatchMessage(post) {
    return axios.post(api.DEL_BATCH_MESSAGE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function clearBatchMessage(post) {
    return axios.post(api.CLEAR_BATCH_MESSAGE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function appConfig(post) {
    return axios.post(api.APP_CONFIG, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function redInfo(post) {
    return axios.post(api.RED_INFO, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function redGrab(post) {
    return axios.post(api.RED_GRAB, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function cashRecord(post) {
    return axios.post(api.CASH_RECORD, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}

function getUserDevice(post) {
    return axios.post(api.GET_USER_DEVICE, post).then((res) => {
        if (res) {
            return res.data;
        }
    });
}


// 自定义表情 end






export {
    queryUserByAccount,
    modifyUser,
    queryUserByid,
    login,
    getUserInfo,
    logout,
    registerUser,
    phoneCode,
    captchaPuzzleVer,
    captchaPuzzle,
    phoneCodeVer,
    getElseMail,
    loginByCode,
    addUserRelation,
    userAcceptOrRefuse,
    roomAcceptOrRefuse,
    delteUserRealation,
    findAllUserRelation,
    getAllTeam,
    editUserTeam,
    delUserTeam,
    updateTeam,
    outRoomRealation,
    findAllRoomRelation,
    findUsersByRoomId,
    delRoomAdmin,
    addRoomAdmin,
    kickRoom,
    inviteRoom,
    queryRoomsByIds,
    muteUser,
    unMuteUser,
    addRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom,
    imGetOfflineMsg,
    goimfilesUpload,
    sendMsg,
    imMsgReceipt,
    imMsgReadInfo,
    imBackMessage,
    imRedMsg,
    imGrabRed,
    imRedInfo,
    getUserSessionList,
    getOfflineMsgById,
    delUserSessionList,
    topMessage,
    safeQueryQuestion,
    safeAddQuestion,
    safeGetQuestion,
    safeCheckAnswer,
    safeUpdateQuestion,
    accountSafeQuestion,
    accountCheckAnswer,
    complain,
    share,
    checkAppVersion,
    feedback,
    pictureColList,
    pictureCol,
    delPictureCol,
    setFriendName,
    updatePassword,
    actUpdPass,
    accountFeedback,
    accountSetShow,
    checkRegister,
    getAccountShow,
    doNotDistrub,
    updateRoomSetting,
    changeOwner,
    bannedList,
    userBlackList,
    addBlackList,
    delBlackList,
    getAllDevice,
    logoutDevice,
    logoutOtherDevice,
    discovery,
    batchSendMessage,
    redMsg,
    batchMessage,
    delBatchMessage,
    clearBatchMessage,
    appConfig,
    redInfo,
    redGrab,
    cashRecord,
    getUserDevice
};