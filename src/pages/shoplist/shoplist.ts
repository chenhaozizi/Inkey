import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController,ActionSheetController } from 'ionic-angular';
import { AppService,AppGlobal } from './../../app/app.service';

import {MINI_SHAREPATH} from "../../providers/Constants";
let token,oldtime;

import { AppShare } from '../../app/app.share';
/**
 * Generated class for the ShoplistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shoplist',
  templateUrl: 'shoplist.html',
})
export class ShoplistPage {
  goodlist;par;ip_src;comid;listlen;hasmore=false;userinfo;GoodsDetailPage;keywords
  constructor(public navCtrl: NavController,public appShare:AppShare, public navParams: NavParams,public modalCtrl:ModalController,public actionSheetCtrl:ActionSheetController,
     public appService:AppService,) {
      this.GoodsDetailPage='GoodsDetailPage'
      this.ip_src=AppGlobal.shopsrc;
    token=window.localStorage.getItem("user_token");
    oldtime = window.localStorage.getItem("oldtime");
    this.appService.getItem("userInfo",res=>{
      this.userinfo=res
      this.comid=res.CompanyId;
      console.log("店铺ID", this.comid)
    })
    
 this.init()
  }
init(){
  this.par={
    StoreId:  this.comid,
    PageIndex:1,
    PageSize:7,
    GoodsName:this.keywords
}
  this.appService.doInit(30,'post','/Api/Good/GetGoodsListPaged',this.par,d=>{
    console.log("测试下拉刷新获取数据：",d)
    this.goodlist = d;
    this.listlen = d.length
    this.hasmore =this.appService.hasemore
    console.log(this.appService.hasemore)
  })
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoplistPage');
    if(this.appService.checktoken(token,oldtime)){
      console.log('token有效')
      //this.goodslist(0);
  }else{
      console.log("token无效")
      this.appService.setItem("user_token","");
      this.appService.setItem("oldtime","");
      this.appService.setItem("userInfo","");
  }
}
//商品列表
  goodslist(status){
    var s = true;if(status)s=false;
      this.appService.httpPost('/Api/Good/GetGoodsListPaged', this.par, d => {
        if(status){
          this.goodlist=this.goodlist.concat(d.Item);
          if(d.Pagination.PageCount>this.par.PageIndex+1){this.par.PageIndex+=1;}else{this.hasmore=false;console.log('没有数据了')}
        }
          this.goodlist = d.Item;
          this.listlen = d.Item.length
      }, s, '');
  }
  share(event,index,id) {
    var path='?scene='+this.userinfo.CompanyId+'_1_'+this.userinfo.Id
    console.log(index)
    var par;
    par={
        'Logo':this.goodlist[index].GoodsImg,
        'Title':this.goodlist[index].GoodName,
        'ShareLink':'www.baidu.com',
        'description':this.goodlist[index].SpecDes,
        'GoodsId':id,
        'sharid':id,
        'Path':MINI_SHAREPATH.productDetail+path

    }
    let actionSheet = this.actionSheetCtrl.create({
      title: '分享',
      buttons: [
        {
          text: '微信好友',
          handler: () => {
            this.appShare.wxShare(0,par,0)
          }
        },
        {
          text: '朋友圈',
          handler: () => {
            this.appShare.wxShare(1,par,0)
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
  //下拉刷型界面
  doRefresh(refresher) {
    this.appService.doRefresh(refresher);
  }
  // 上拉加
  doInfinite(infiniteScroll) {
   this.appService.doMoreload(infiniteScroll)
  }
  search(){
    console.log(this.keywords)
    this.init()
  }
}
