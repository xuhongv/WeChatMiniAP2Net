Page({
    data: {
        ssid: '',
        password: '',
        showClearBtn: false,
        isWaring: false,
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
        if (this.data.password.length < 8) {
            this.setData({
                isWaring: true,
            });
        }
    },
});