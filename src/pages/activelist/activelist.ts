import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import { AppService,AppGlobal } from "../../app/app.service";
import {MINI_SHAREPATH} from "../../providers/Constants";
// 
/**
 * Generated class for the ActivelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-activelist',
    templateUrl: 'activelist.html',
})
export class ActivelistPage {
    activities;
    infopage;
    userInfo;
    PageIndex=1;
    PageSize=6;
    ip_src;
    hasmore=true;
    addactivepage;activelen;keywords
    constructor(public navCtrl: NavController, public appService: AppService, public navParams: NavParams, public appShare: AppShare, public actionSheetCtrl: ActionSheetController, ) {
        this.infopage = 'ActiveInfoPage';
        this.addactivepage ='AddactivePage'
        this.ip_src = AppGlobal.shopsrc;
        this.appService.getItem("userInfo",res=>{
            this.userInfo=res;
        })
        this.init(0)
       
    }
    ionViewWillEnter() {
        setTimeout(() => {
          this.init(0);
        }, 10);
    }
    init(status){
         // 本店活动api
         var d = true
         if(status==1){
            d=false
         }
         this.appService.httpPost('/Api/Activity/GetListPaged', { "StoreId": this.userInfo.CompanyId, "PageIndex": this.PageIndex, "PageSize": this.PageSize ,"Title":this.keywords}, res => {
            console.log('活动列表：', res);
            for(var i = 0;i<res.Item.length;i++){
                res.Item[i].EndTime=this.appService.getNowFormatDate(res.Item[i].EndTime,false);
                res.Item[i].StartTime=this.appService.getNowFormatDate(res.Item[i].StartTime,false);
            }
           if(status){
            this.activities=this.activities.concat(res.Item)
            if(res.Pagination.PageCount>this.PageIndex+1){this.PageIndex+=1;}else{this.hasmore=false}
           }
            this.activities = res.Item;
            this.activelen = res.Item.length
        }, d, '')
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad ActivelistPage');

    }
    
      //下拉刷型界面
      doRefresh(refresher) {
        this.init(0)
        setTimeout(() => {
          
        refresher.complete();
        }, 1500);
      }
      // 上拉加载更多
      doInfinite(infiniteScroll) {
      if(this.hasmore){
        this.init(1)
        
      }
      setTimeout(() => {
        infiniteScroll.complete();
    }, 1500)
      }
      search(){
        // this.keywords=this.keyword 
        console.log(this.keywords)
        this.init(1);
      }
}
