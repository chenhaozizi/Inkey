import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService, AppGlobal } from "../../app/app.service";
import { initDomAdapter } from '@angular/platform-browser/src/browser';

/**
 * Generated class for the SharerecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sharerecord',
  templateUrl: 'sharerecord.html',
})
export class SharerecordPage {
  id;
  user_token;
  ip_src;
  hasmore = false
  shareRecodList = [];
  PageIndex;
  tabs = [
    { key: '商品', id: 0, isSelect: true },
    { key: '活动', id: 1, isSelect: false },
    { key: '盈客圈', id: 2, isSelect: false },
    { key: '优惠券', id: 3, isSelect: false }
  ]
  select = 0;
  shareRecordInfoPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, private appService: AppService) {
    this.shareRecordInfoPage= 'ShareRecordInfoPage'

    this.PageIndex = 1
    this.appService.getItem("userInfo", res => {
      this.id = res.Id;
      this.ip_src = AppGlobal.shopsrc;
      console.log("当前id：", this.id)
    })
    this.appService.getItem("user_token", res => {
      this.user_token = res
      console.log("当前token：", this.user_token)
    })
  }
  ionViewWillEnter() {
    this.init()//数据初始化
  }
  //初始化
  init() {
    let parm = { "UserId": this.id, "PageIndex": this.PageIndex, "PageSize": 10, "ShareType": this.select }
    this.appService.doInit(10,'post','/Api/ShareRecord/GetShareRecordListPaged',parm,d=>{
      console.log("测试下拉刷新获取数据：",d)
      d.forEach(itm => {
        itm.ShareTime = this.appService.getNowFormatDate(itm.ShareTime, true)
      });
      this.shareRecodList = d;
      this.hasmore =this.appService.hasemore
     
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharerecordPage');
    
  }

  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.init()
  };
  //下拉刷型界面
  doRefresh(refresher) {
    this.appService.doRefresh(refresher);
  }
  // 上拉加
  doInfinite(infiniteScroll) {
   this.appService.doMoreload(infiniteScroll)
  }
}
