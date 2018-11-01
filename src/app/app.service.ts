import { LoadingController, AlertController, ToastController, App, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
let hastoken, self;
let PageIndex: any = 0,//当前页数
    PageSize: 10,//每页总数
    totalPages = 1,//总页数
    backdata = [],//存储数据
    flag = false,//防止重复加载
    bugg = false;//防止第一次上拉加载
@Injectable()

export class AppGlobal {

    static cache: any = {
        slides: "_dress_slides",
        categories: "_dress_categories",
        products: "_dress_products"
    }

    static domain = "http://mobileapi.inkey.club";//http://110.185.185.146:8004   http://139.159.146.138:8010
    static imgsrc = "https://img.inkey.club";//文章列表
    static shopsrc = "https://img.inkey.club";//活动，商品
    static defautsharimg = 'https://img.inkey.club/files/qz.jpg';//盈客圈默认分享图片
    static defautcoupimg = 'https://img.inkey.club/files/cou.jpg'//优惠券活动默认分享图片
    static WXcode = 'https://bjgxly.com/webchat-api/weixin/getwxacode'//微信二维码接口
    static iosAppId='1439860964'// 1332971579 ios APPid
    static API: any = {
        getCategories: '/api/ionic3/getCategories',
        getProducts: '/api/ionic3/getProducts',
        getDetails: '/api/ionic3/details',
    };

}

@Injectable()
export class AppService {
    public user_token: string = ''; hasemore = true;;
    public headers; public doinit: any; public doRefresh; public doMoreload;
    constructor(public http: Http, public events: Events, public loadingCtrl: LoadingController, private alertCtrl: AlertController, private toastCtrl: ToastController, public app: App) { 
        self = this;
    }
      
       
    encode(params) {
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = '?' + str.substring(0, str.length - 1);
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = true, token?) {
        this.getItem("user_token", res => {
            hastoken = res
        })
        console.log("get请求")
        if (this.checktokens()) {
            this.headers = {
                headers: {
                    'Token': token || hastoken
                }
            };
            let loading = this.loadingCtrl.create({
                content: '加载中...'//数据加载中显示
            });
            if (loader) {
                loading.present();
            }
            this.http.get(AppGlobal.domain + url + this.encode(params), this.headers)
                .toPromise()
                .then(res => {
                    var d;
                    console.log(res.json())
                    if (res.json().IsValid) {
                        d = res.json().Data
                        if (res.json().Data == '') {
                            d = true;
                        }
                    }
                    if (loader) {
                        loading.dismiss();
                    }
                    callback(d == null ? "[]" : d);
                })
                .catch(error => {
                    console.log(error)
                    console.log(error.status)

                    if (loader) {
                        loading.dismiss();
                    }
                    this.handleError(error);
                });
        } else {
            var d = false
            callback(d);
            console.log("清除数据")
            this.setItem("userInfo", "");
            this.setItem("user_token", "");
            this.setItem("oldtime", "");
            this.events.publish('toLogin');

        }
    }

    httpPost(url, params, callback, loader: boolean = false, token?) {
        this.getItem("user_token", res => {
            hastoken = res
        })
        console.log(hastoken)
        console.log("post请求")
        if (this.checktokens()) {

            if (url == '/Api/MediaFiles/Upload') {
                console.log("图片上传");
                this.headers = {
                    headers: {
                        'Accept': 'application/json',
                        'Token': token || hastoken,
                        'Content-Type': 'multipart/form-data'
                    }
                };
                console.log(this.headers)
            } else {
                this.headers = {
                    headers: {
                        'Token': token || hastoken,

                    }
                };
            }
            console.log(params)
            let loading = this.loadingCtrl.create({
                content: '加载中...'//数据加载中显示
            });
            if (loader) {
                loading.present();
            }
            this.http.post(AppGlobal.domain + url, params, this.headers)
                .toPromise()
                .then(res => {
                    var d;
                    console.log(res.json())
                    if (res.json().IsValid) {
                        d = res.json().Data;
                        if (res.json().Data == '') {
                            d = true;
                        }
                    } else {
                        d = res.json().ErrorMessages
                    }

                    if (loader) {
                        loading.dismiss();
                    }
                    callback(d == null ? "[]" : d);
                }).catch(error => {
                    console.log(error)
                    if (error.status == 401) {
                        self.events.publish('toLogin');
                        callback(error.status);

                    }
                    console.log(loader)
                    if (loader) {
                        console.log(loader)
                        loading.dismiss();
                    }
                    this.handleError(error);
                });
        } else {
            var d = false
            callback(d);
            this.setItem("userInfo", "");
            this.setItem("user_token", "");
            this.setItem("oldtime", "");
            console.log("清除数据")
            this.events.publish('toLogin');

        }
    }
    private handleError(error: Response | any) {
        let msg = '';
        console.log(error)
        this.toast(error.ErrorMessages);
        if (error.status == 400) {
            msg = '请求无效(code：404)';
            console.log('请检查参数类型是否匹配');
        }
        if (error.status == 401) {
            msg = 'token失效)';
            console.log('token失效,返回登陆')
            this.events.publish('toLogin');
        }
        if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        }
        if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        }
        console.log(error);
        if (msg != '') {
            this.toast(msg);
        }
    }
    checktokens() {
        let a, b;
        this.getItem("oldtime", res => {
            a = res;
        })
        if (!hastoken) {
            console.log("是登陆")
            return true
        } else {
            this.getItem("user_token", res => {
                b = res;
            })
            return this.checktoken(b, a)
        }
    }
    getResources(url, callback) {
        this.http.get(url).subscribe(res => {
            callback(res.json() == null ? "[]" : res.json());
        })
    }
    alert(message, callback?) {
        if (callback) {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: [{
                    text: "确定",
                    handler: data => {
                        callback();
                    }
                }]
            });
            alert.present();
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                message: message,
                buttons: ["确定"]
            });
            alert.present();
        }
    }
    toast(message, callback?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            dismissOnPageChange: true,
        });
        toast.present();
        if (callback) {
            callback();
        }
    }

    //时间戳格式化
    getNowFormatDate(date, hashour) {
        // return new Date(parseInt(date)*1000).toLocaleString().replace(/:d{1,2}$/,'')
        //return new Date(parseInt(date)*1000).toLocaleString().replace(/年|月/g,"-").replace(/日/g,' ')
        var now = new Date(date);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date: any = now.getDate();
        var hour: any = now.getHours();
        if (hour < 10) { hour = "0" + hour }
        var minute: any = now.getMinutes();
        if (minute < 10) { minute = "0" + minute }
        var second: any = now.getSeconds();
        if (second < 10) { second = "0" + second }
        console.log(year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second)
        if (hashour) {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        } else {
            return year + "-" + month + "-" + date;
        }
    }
    checktoken(token, oldtime) {
        if (typeof (token) == "undefined" || token == "") {
            return false;
        }
        var nowtime = new Date().getTime()
        //判断当前时间和过期时间的比较
        if (nowtime < oldtime) {
            return true;
        } else {
            return false;
        }
    }

    setItem(key: string, obj: any) {
        try {
            var json = JSON.stringify(obj);
            window.localStorage[key] = json;
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    getItem(key: string, callback) {
        try {
            var json = window.localStorage[key];
            var obj = JSON.parse(json);
            callback(obj);
        }
        catch (e) {
            console.error("window.localStorage error:" + e);
        }
    }
    //下拉刷新和下拉加载更多
    backTurn(size, method, url, par, callback) {
        var This = this;
        This.doinit = function () {
            // 请求后台服务器
            var param = {
                PageIndex: 1,
                PageSize: PageSize
            };
            for (var one in par) { if (par[one] == null) par[one] = ''; param[one] = par[one]; }
            if (method == 'post') {//post请求
                self.httpPost(url, param, res => {
                    totalPages = res.Pagination.PageCount
                    if (totalPages > parseInt(PageIndex + 1)) { flag = true; this.hasemore = false }
                    backdata = res.Item;
                    callback(res.Item)
                })
            } else {//get请求
            }
            PageIndex = 1//初始化页面为1
        }
        This.doinit();
        //下拉刷新
        This.doRefresh = function (refresher) {
            console.log('下拉刷新')
            //初始化数据，下拉舒心只请求第一页的数据
            PageIndex = 1,//当前页数
                PageSize = size,//每页条数
                totalPages = 1,//总页数
                flag = false,//防止重复加载
                this.hasemore = true;
            backdata = [],
                bugg = false;//防止第一次上拉加载
            var param = {
                PageIndex: 1,
                PageSize: PageSize
            };
            console.log('下拉刷新', '当前页:', PageIndex)
            for (var one in par) { if (par[one] == null) par[one] = ''; param[one] = par[one]; }
            if (method == 'post') {//post请求
                self.httpPost(url, param, res => {
                    console.log(111111111, res)
                    totalPages = res.Pagination.PageCount
                    if (totalPages > parseInt(PageIndex + 1)) { flag = true; this.hasemore = false; }
                    backdata = res.Item;
                    callback(res.Item)
                    setTimeout(function () { refresher.complete() }, 500);
                })
            } else {//get请求
            }
            PageIndex = 1//初始化页面为1
        }
        //上拉加载更多
        This.doMoreload = function (infiniteScroll) {
            console.log('上拉加载更多')
            var timer = null;
            PageIndex++;
            console.log(PageIndex)
            // 请求后台服务器
            var param = {
                PageIndex: 1,
                PageSize: PageSize
            };
            for (var one in par) {
                if (par[one] == null) par[one] = '';
                if (one == 'PageIndex') {
                    param[one] = PageIndex
                } else {
                    param[one] = par[one];
                }
            }
            if (method == 'post') {//post请求
                self.httpPost(url, param, res => {
                    console.log(111111111, res)
                    if (res.Item.length > 0) {
                        let data1 = backdata; backdata = [];
                        //原有的数据
                        for (let i = 0, n = data1.length; i < n; i++) { backdata.push(data1[i]); }
                        //新增的数据
                        if (PageIndex !== 1) {
                            for (let i = 0, s = res.Item.length; i < s; i++) { backdata.push(res.Item[i]); }
                        }
                    }
                    if (res.Pagination.PageCount < parseInt(PageIndex + 1)) {
                        console.log('没有数据了')
                        flag = false;
                        this.hasemore = true
                    }
                    callback(backdata)
                    setTimeout(function () { infiniteScroll.complete() }, 500);
                })
            } else {//get请求
            }

            if (!flag) {
                setTimeout(function () { infiniteScroll.complete() }, 500);
            }
        }
    }
    doInit(size, method, url, par, callback) {
        return this.backTurn(size, method, url, par, callback)
    }

    //页面处理
    pageAsk(askPageType, par, call) {
        if (askPageType == 1 || askPageType == 2) {
            console.log('页面初始化或者刷新')
            par.PageIndex = 1;
            call(par)
        } else if (askPageType == 3) {
            console.log("页面加载更多")
            par.PageIndex = par.PageIndex + 1;
            call(par)
        }
        console.log('返回的par', par)
    }
    //分页初始化
    chushihua(askUrl: string, params,callback, askPageType, refreshType?) {
        console.log(askUrl, params, askPageType,refreshType)
            this.pageAsk(askPageType, params, res => {
                params.PageIndex = res.PageIndex
                this.httpPost(askUrl, params, d => {
                    if (d) {
                        callback(d)
                        if (refreshType) {
                           refreshType.complete();  
                        }
                    }else{
                        if(refreshType){
                            refreshType.complete();
                            this.toast("请求超时，请稍后再试")
                        }                   
                    }                   
                });
            })
    }
}
