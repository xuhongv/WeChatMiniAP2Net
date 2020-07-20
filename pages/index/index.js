Page({
    data: {
        ssid: '',
        password: '',
        udp: '',
        port: 0,
        showClearBtn: false,
        isFirst: true,
    },
    onLoad(opt) {
        let that = this
        wx.startWifi({
            success(res) {
                console.log(res.errMsg, 'wifi初始化成功')
                that.getWifiInfo();
            },
            fail: function (res) {
                wx.showToast({
                    title: '请连接路由器!',
                    duration: 2000,
                    icon: 'none'
                })
            }
        })
        this.getWifiInfo()
    },
    getWifiInfo() {
        let that = this
        wx.getConnectedWifi({
            success(res) {
                console.log("getConnectedWifi ok:", JSON.stringify(res))
                if ('getConnectedWifi:ok' === res.errMsg) {
                    that.setData({
                        ssid: res.wifi.SSID,
                        bssid: res.wifi.BSSID
                    })
                } else {
                    wx.showToast({
                        title: '请连接路由器',
                        duration: 2000,
                        icon: 'none'
                    })
                }
            },
            fail(res) {
                wx.showToast({
                    title: '请连接路由器',
                    duration: 2000,
                    icon: 'none'
                })
            }
        })
    },
    onInputSSID(evt) {
        const {
            value
        } = evt.detail;
        this.setData({
            ssid: value,
        });
    },
    onInputPassword(evt) {
        const {
            value
        } = evt.detail;
        this.setData({
            password: value,
            showClearBtn: !!value.length,
            isWaring: false,
        });
    },
    onClear() {
        this.setData({
            password: '',
            showClearBtn: false,
            isWaring: false,
        });
    },
    onConfirm() {
        console.log("ssid:", this.data.ssid, ",password:", this.data.password)
        if (this.data.isFirst) {
            let udp = wx.createUDPSocket();
            this.setData({
                isFirst: false,
                udp,
                port: udp.bind(),
            });
        }

        const password = this.data.password;
        const ssid = this.data.ssid;
        const port = this.data.port;

        let message = JSON.stringify({
            port,
            password,
            ssid
        })

        this.data.udp.send({
            address: '192.168.4.1',
            port: 1000,
            message
        });


        this.data.udp.onMessage((res) => {
            //字符串转换，很重要
            let unit8Arr = new Uint8Array(res.message);
            let encodedString = String.fromCharCode.apply(null, unit8Arr);
            let data = decodeURIComponent(escape((encodedString)));
            console.log("data:", data);
            let str = JSON.parse(data);
            switch (str.code) {
                //成功收到信息
                case 0:
                    wx.showToast({
                        title: '接收成功',
                    })
                    break;
                //成功解析到信息
                case 1:
                    wx.showToast({
                        title: '准备连接路由器',
                    })
                    break;
                //成功连接到路由器
                case 2:
                    wx.showToast({
                        title: '成功连接',
                    })
                    break;
            }
        })

        console.log("Msg:", message);
        //AT+CIPSENDEX=0,5,"192.168.4.2",51180

    },
});