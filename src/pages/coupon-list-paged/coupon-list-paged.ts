import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController } from 'ionic-angular';
import { AppService,AppGlobal } from '../../app/app.service';
import { AppShare } from '../../app/app.share';
import {MINI_SHAREPATH} from "../../providers/Constants";
/**
 * Generated class for the CouponListPagedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coupon-list-paged',
  templateUrl: 'coupon-list-paged.html',
})
export class CouponListPagedPage {
  PageSize=10;
  PageIndex=1;
  coupons;
  couponslen;
  userInfo;ip_src;coupondetailpage

  constructor(public navCtrl: NavController,public appService:AppService,public appShare:AppShare, public actionSheetCtrl: ActionSheetController, public navParams: NavParams) {
    this.appService.getItem("userInfo",res=>{
      this.userInfo=res;
  })
  this.coupondetailpage='CouponDetailPage'
  this.ip_src = AppGlobal.shopsrc;
this.init();
  }

  init(){
    this.appService.httpPost('/Api/Coupon/GetListPaged',{"StoreId":this.userInfo.CompanyId,"PageIndex": this.PageIndex, "PageSize": this.PageSize},res=>{
      console.log('优惠券列表:',res);
      for(var i=0;i<res.Item.length;i++){
        res.Item[i].EndTime=this.appService.getNowFormatDate(res.Item[i].EndTime,false);
        res.Item[i].StartTime=this.appService.getNowFormatDate(res.Item[i].StartTime,false);
      }
      this.coupons=res.Item;
      this.couponslen=res.Item.length
    },true,'')
  }


  

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponListPagedPage');
  }

}
