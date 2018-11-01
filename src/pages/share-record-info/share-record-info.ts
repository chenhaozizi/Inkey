import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from "../../app/app.service";

/**
 * Generated class for the ShareRecordInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-record-info',
  templateUrl: 'share-record-info.html',
})
export class ShareRecordInfoPage {
  id;
  cusarr='';

  constructor(public navCtrl: NavController, public navParams: NavParams,public appService:AppService) {
    this.id=this.navParams.get("id");
    console.log('获取的记录id:',this.id);

  }
  getList(){
    let params={
      "ShareRecordId": this.id,
      "PageIndex": 1,
      "PageSize": 10
    }
    this.appService.httpPost('/Api/ShareRecord/ShareRecordBrowseList',params,res=>{
      if(res){
        res.Item.forEach(itm => {
          itm.CreateTime=this.appService.getNowFormatDate(itm.CreateTime,false) 
        });
        this. cusarr=res.Item
      }
    },true,'')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShareRecordInfoPage');
  }

}
