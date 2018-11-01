import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController ,LoadingController} from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import html2canvas from 'html2canvas';//屏幕截图
import { AppService, AppGlobal } from '../../app/app.service';
import { MINI_SHAREPATH } from "../../providers/Constants";
import { Http, Headers, RequestOptions } from '@angular/http';
/**
 * Generated class for the CouponDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let self;
let loading;
@IonicPage()
@Component({
  selector: 'page-coupon-detail',
  templateUrl: 'coupon-detail.html',
})
export class CouponDetailPage {
  coupon;
  ifshow = false;
  userInfo; canvasImg; par; wxcode; wxcodeUrl
  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController, public appService: AppService, public http: Http, public navParams: NavParams, public appShare: AppShare, public actionSheetCtrl: ActionSheetController) {
    this.coupon = this.navParams.get('couponItem');
    this.appService.getItem("userInfo", res => {
      this.userInfo = res;
    })
    self = this
    this.wxcodeUrl =AppGlobal.WXcode;
    loading= this.loadingCtrl.create({
      content: '操作处理中,请耐心等待！'//数据加载中显示
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponDetailPage');
  }
  shareCoupon(event, index) {
    var path = '?scene=' + this.userInfo.CompanyId +MINI_SHAREPATH.linkstr+ '1' + MINI_SHAREPATH.linkstr+this.userInfo.Id
    this.par = {
      'Logo': AppGlobal.defautcoupimg,
      'Title': this.coupon.Title,
      'ShareLink': 'www.baidu.com',
      'CouponId': this.coupon.Id,
      'sharid': this.coupon.Id,
      'description': this.coupon.Describe,
      'Path': MINI_SHAREPATH.coupon + path
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '分享',
      buttons: [
        {
          text: '微信好友',
          handler: () => {
            this.appShare.wxShare(0, this.par)
          }
        },
        {
          text: '朋友圈',
          handler: () => {
            this.ifshow = true
             self.savaImg() 

          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            // actionSheet.dismiss();
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  savaImg() {
    var sharid;
    loading.present()
    this.appService.httpPost('/Api/ShareRecord/AddShareRecord', this.par, res => {
      if (res.Item.IsValid) {
        sharid = res.Item.EntityId;
        var path = ''
        path += '?page=' + MINI_SHAREPATH.coupon;
        path += '&scene=' + this.userInfo.CompanyId +MINI_SHAREPATH.linkstr+ '1' + MINI_SHAREPATH.linkstr+this.userInfo.Id + MINI_SHAREPATH.linkstr + sharid +  MINI_SHAREPATH.linkstr + this.coupon.Id;
        path += '&width=170' + '&name=' + new Date().getTime();
        console.log(path, this.wxcodeUrl + path)
        this.getWXcode(path)
      }
    })

  }
  getWXcode(pars) {
    var headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    let options = new RequestOptions(JSON.stringify({ headers: headers }));
    this.http.request(this.wxcodeUrl + pars, options).subscribe((res) => {
      console.log(res.json().data)
      if (res.json().data) {
        this.wxcode = res.json().data;
        //进入截图
        setTimeout(function () { self.getcavas() }, 1000)

      }
    });
  }
  getcavas() {
    let element: any = document.querySelector("#mainTable");
    html2canvas(element, {
      useCORS: true // 【重要】开启跨域配置
    }).then(canvas => {
      console.log(canvas)
      this.canvasImg = canvas.toDataURL("image/jpeg", 0.5);
      loading.dismiss()
      this.ifshow = false
      this.par.shareimg = this.canvasImg
      console.log('保存的地址：', this.canvasImg)
      console.log(this.par)
      this.appShare.wxShare(1, this.par, 1, 1)
    })
  }
}
