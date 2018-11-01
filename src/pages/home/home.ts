import { Component, ViewChild } from '@angular/core';
import { NavController, ActionSheetController, NavParams, ModalController, App, Platform } from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import { CustomersPage } from '../customers/customers';
import {MINI_SHAREPATH} from "../../providers/Constants";
import { AppService, AppGlobal } from './../../app/app.service';

let token;
let oldtime;
@Component({
  //为页面指定选择器的名称
  //在ionic 3.x中规范为 page- 开头，为了不造成混乱，需要保持每个页面selector的唯一性
  //可以直接通过templateUrl 来引用html,而不直接使用template
  //模板的字符串，里面其实就是html代码
  //template: `<h1>Hello World!</h1>`
  //可以直接通过templateUrl 来引用html,而不直接使用template
  selector: 'page-home',
  templateUrl: 'home.html'
})
//export关键词：将类暴露出去，以便其它的文件可以import到它。
//类的命名：在ionic3中，页面类采用页面名+Page的命名方式，首字母大写，如HomePage, ContactPage等

export class HomePage {
  browlist=[];
  sortPage;
  cardPage;
  ShopdetailPage;
  customersPage;
  cusdetailPage;
  sharerecordPage;
  shoplistpage;
  activepage
  par;
  username;
  userInfo;
  rootPage;
  goodlist;
  ip_src;
  acinfopage;
  msgPage;
  orderPage;
  comid; goodslen; activelen;couponlistpage;coupondetailpage;
  coupons;couponslen;token;GoodsDetailPage
  public activity = [];
  msgNum=0;//未读消息数

  @ViewChild("header") header;
  constructor(public platform: Platform, public appCtrl: App, public navCtrl: NavController, public appService: AppService, public modalCtrl: ModalController,
    public appShare: AppShare, public actionSheetCtrl: ActionSheetController, public navParams: NavParams) {
    this.ip_src = AppGlobal.shopsrc;
    this.GoodsDetailPage='GoodsDetailPage'
    this.sortPage = 'SortPage';
    this.cardPage = 'CardPage';
    this.ShopdetailPage = 'ShopdetailPage';
    this.customersPage = CustomersPage;
    this.sharerecordPage = 'SharerecordPage';
    this.shoplistpage = 'ShoplistPage';
    this.activepage = 'ActivelistPage';
    this.acinfopage = 'ActiveInfoPage';
    this.msgPage = 'MsgPage';
    this.orderPage = 'OrderPage';
    this.couponlistpage='CouponListPagedPage';
    this.coupondetailpage='CouponDetailPage';
    this.appService.getItem("userInfo", res => {
      this.userInfo = res
      this.username = res.Name
      this.comid = res.CompanyId
    });
    this.appService.getItem("user_token",res=>{
      this.token=res;
    })
     
    this.appService.getItem('isclick', res => {
      console.log('点击消息，跳转到消息列表', res)
      if (res == 1) {
        this.navCtrl.push('MsgPage');

      }
      this.appService.setItem('isclick', 0)
    })
    this.par = {
      'StoreId': this.comid,
      'PageIndex': 1,
      'PageSize': 100
    }
    // token = window.localStorage.getItem("user_token");
    oldtime = window.localStorage.getItem("oldtime");
    this.appService.getItem("user_token", res => {
      token = res;
      console.log(token);

    })
    console.log(token)
    console.log(this.appService.checktoken(token, oldtime))

  }
  ionViewWillEnter() {
    this.appService.getItem("userInfo", res => {
      this.userInfo = res
      this.username = res.Name
      this.comid = res.CompanyId
    })
    this.getMsgNum();

  }
  ionViewDidLoad() {
    this.par = {
      StoreId: this.comid,
      PageIndex: 1,
      PageSize: 100
    }
    this.initload();

  }
  initload() {
    this.appService.httpGet('/Api/Home/GetLastVisitors', "", d => {
      if (d) {
        this.browlist = d.Item.splice(0, 5);
        console.log('token有效')
        this.goodslist();
        this.activelist();
        this.couponlist();
      } else {
        console.log("token无效")
      }

      console.log(d);
    }, false, token);

    //商品列表

  }


  //商品列表
  goodslist() {
    this.appService.httpPost('/Api/Good/GetGoodsListPaged', this.par, d => {
      if (d) {
        this.goodlist = d.Item.splice(0, 4);//读取前4条数据
        this.goodslen = d.Item.length;
        console.log(this.goodslen)
        console.log("商品列表", d)
      } else {
        console.log("token无效")
      }

    }, false, '');
  }
  activelist() {
    // 本店活动api
    this.appService.httpPost('/Api/Activity/GetListPaged', { "StoreId": this.userInfo.CompanyId, "PageIndex": 1, "PageSize": 2 }, res => {
      if (res) {
        console.log('活动列表：', res);
        this.activity = res.Item
        this.activelen = res.Item.length
      } else {
        console.log("token无效")
      }
    }, false, '')
  }

  couponlist(){
    //优惠券API
    this.appService.httpPost('/Api/Coupon/GetListPaged',{"StoreId": this.userInfo.CompanyId,"PageIndex": 1, "PageSize": 2},res=>{
      console.log('优惠券列表:',res);
      for(var i=0;i<res.Item.length;i++){
        res.Item[i].EndTime=this.appService.getNowFormatDate(res.Item[i].EndTime,false);
        res.Item[i].StartTime=this.appService.getNowFormatDate(res.Item[i].StartTime,false);
      }
      this.coupons=res.Item;
      this.couponslen=res.Item.length;

    },false,'')
  }

  
 
  
 
  //下拉刷型界面
  doRefresh(refresher) {
    console.log("下拉刷新");
    this.initload();
    setTimeout(() => {
      console.log('加载完成后，关闭刷新');
      refresher.complete();
    }, 500);
  }
  //通知提示
  getMsgNum(){
    this.appService.httpGet('/Api/Home/GetMessageRead','',res=>{
      console.log('未读消息数：',res.Item)
      this.msgNum=res.Item;
    },false,token)
  }
}
