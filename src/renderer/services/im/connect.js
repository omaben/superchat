import axios from '@/services/ajax';
import api from '@/services/api';
const { remote, ipcRenderer } = require('electron')
import { getUserSessionList } from '@/services'
import {
    app,
} from "electron";
import Bus from '@/services/bus';
import { getUserStore } from "tool/storage";

var IMkey = "";
var comMsg = {}

function IM() {
    const rawHeaderLen = 16;
    const packetOffset = 0;
    const headerOffset = 4;
    const verOffset = 6;
    const opOffset = 8;
    const seqOffset = 12;
    let heartNum = 0;
    // Bus.isConnect = false; //TODO ①
    var Client = function() {
        Bus.isConnect = true; //TODO ①
        var MAX_CONNECT_TIMES = 30;
        var DELAY = 1500;
        this.createConnect(MAX_CONNECT_TIMES, DELAY);

    };

    Client.prototype.createConnect = function(max, delay) {
        var self = this;
        if (max === 0) {
            return;
        }
        connect();
        async function getIMKey() {
            let res = await axios.post(api.IM_KEY);
            // if (res.status === 200) {
            if (res && res.data && res.data.success) {
                comMsg = res.data.data;
                return comMsg;
            } else {
                if (res && res.data && res.data.code == 1008) {
                    return -1;
                } else {
                    return false;
                }
            }
            // }
        }
        var textDecoder = new TextDecoder();
        var textEncoder = new TextEncoder();
        window.heartbeatInterval;

        async function connect() {
            console.log("进入连接。。。。。");
            clearInterval(window.heartbeatInterval);
            IMkey = await getIMKey();
            // ---- 当conn接口未返回时，直接return。

            // ---- 当conn接口未返回时，直接return。
            if (IMkey == -1) {
                return;
            } else {
                if (!IMkey) {
                    setTimeout(() => {
                        connect();

                        clearInterval(window.msgTimer);
                        window.msgTimer = 0;

                    }, 10000);
                    return;
                }
            }


            var wsUrl;
            if (window.location.protocol === "https:") {
                wsUrl = "wss://" + IMkey.server + "/sub";
            } else {
                wsUrl = "ws://" + IMkey.server + "/sub";
                // wsUrl = "ws://ws.pkbeta.com/sub";

            }


            var ws = new WebSocket(wsUrl);
            window.ws = ws;
            ws.binaryType = "arraybuffer";
            ws.onopen = function() {
                Bus.$emit('wsStatus', 'connecting');
                auth();
            };

            ws.onmessage = function(evt) {
                clearInterval(window.msgTimer);
                window.msgTimer = 0;
                var data = evt.data;

                var dataView = new DataView(data, 0);
                var packetLen = dataView.getInt32(packetOffset);
                var headerLen = dataView.getInt16(headerOffset);
                var ver = dataView.getInt16(verOffset);
                var op = dataView.getInt32(opOffset);
                var seq = dataView.getInt32(seqOffset);
                switch (op) {
                    case 8:
                        // auth reply ok
                        // document.getElementById("status").innerHTML = "<color style='color:green'>ok<color>";
                        // send a heartbeat to server
                        heartbeat();
                        window.heartbeatInterval = setInterval(heartbeat, 30 * 1000);
                        break;
                    case 3:
                        // receive a heartbeat from server
                        Bus.$emit('wsStatus', 'online');
                        console.log("heartbeatBack......");
                        heartNum = 0;
                        break;
                    case 9:
                        // batch message
                        for (var offset = rawHeaderLen; offset < data.byteLength; offset += packetLen) {
                            // parse
                            var packetLen = dataView.getInt32(offset);
                            var headerLen = dataView.getInt16(offset + headerOffset);
                            var ver = dataView.getInt16(offset + verOffset);
                            var op = dataView.getInt32(offset + opOffset);
                            var seq = dataView.getInt32(offset + seqOffset);
                            var msgBody = textDecoder.decode(data.slice(offset + headerLen, offset + packetLen));
                            // callback
                            messageReceived(ver, msgBody);
                        }
                        break;
                    default:
                        var msgBody = textDecoder.decode(data.slice(headerLen, packetLen));
                        messageReceived(ver, msgBody);
                        break;
                }
            };

            ws.onclose = function() {
                console.error("onclose-私聊和密聊重新连接--->链接失败");
                Bus.$emit('wsStatus', 'disconnect');
                // TODO 给一个是否链接上im的图标 点击之后可以重连
                let isUserClose = sessionStorage.getItem('userClose');
                if (getUserStore("token") && !isUserClose) {
                    heartNum = 0;

                    clearInterval(window.msgTimer);
                    window.msgTimer = 0;
                    setTimeout(reConnect, delay);
                } else {

                    getUserSessionList().then((res) => {
                        if (!res || res.success) {
                            setTimeout(reConnect, delay);
                        } else {
                            ipcRenderer.send("reload");
                        }
                    })
                }
            };

            function heartbeat() {
                var headerBuf = new ArrayBuffer(rawHeaderLen);
                var headerView = new DataView(headerBuf, 0);
                headerView.setInt32(packetOffset, rawHeaderLen);
                headerView.setInt16(headerOffset, rawHeaderLen);
                headerView.setInt16(verOffset, 1);
                headerView.setInt32(opOffset, 2);
                headerView.setInt32(seqOffset, 1);
                // console.log("heartbeat......");
                if (heartNum >= 5) {
                    ws.close();
                    heartNum = 0;
                    clearInterval(window.heartbeatInterval);
                    window.heartbeatInterval = 0;

                } else {
                    ws.send(headerBuf);
                    heartNum++;
                }
            }

            function auth() {
                // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
                let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                // let userInfo = getUserStore("userInfo");
                var token = {
                    userId: userInfo.id,
                    key: comMsg.key
                };
                token = JSON.stringify(token);
                var headerBuf = new ArrayBuffer(rawHeaderLen);
                var headerView = new DataView(headerBuf, 0);
                var bodyBuf = textEncoder.encode(token);
                headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
                headerView.setInt16(headerOffset, rawHeaderLen);
                headerView.setInt16(verOffset, 1);
                headerView.setInt32(opOffset, 7);
                headerView.setInt32(seqOffset, 1);
                ws.send(mergeArrayBuffer(headerBuf, bodyBuf));
            }

            function messageReceived(ver, body) {
                let data = typeof body === 'string' ? JSON.parse(body) : body;
                Bus.$emit('IM', data); //通过vue的event bus 来实现每个页面接受收到的消息
            }

            function mergeArrayBuffer(ab1, ab2) {
                var u81 = new Uint8Array(ab1),
                    u82 = new Uint8Array(ab2),
                    res = new Uint8Array(ab1.byteLength + ab2.byteLength);
                res.set(u81, 0);
                res.set(u82, ab1.byteLength);
                return res.buffer;
            }

        }

        function reConnect() {
            Bus.$emit('wsStatus', 'connecting');
            self.createConnect(--max, delay * 2);
        }
    };
    //第一次是登录 Bus.isConnect=undefined 调用 
    // 之后在 本文件 TODO ① Bus.isConnect = true;

    // 第二次是首页调用，Bus.isConnect = true; //不连接

    //第三次刷新页面 Bus.isConnect=undefined 调用-回到第一次

    if (!Bus.isConnect) {
        new Client();
    }
}

export default IM;