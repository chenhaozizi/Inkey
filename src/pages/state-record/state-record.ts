import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
/**
 * Generated class for the StateRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-state-record',
  templateUrl: 'state-record.html',
})

export class StateRecordPage {
  tabs;
  select=0;
  id;
  ip_src = AppGlobal.shopsrc;recordList=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public appService: AppService,) {
    this.id=this.navParams.get('id');
    this.select = this.navParams.get('type')
    console.log(this.id,this.select);
    this.tabs = [
      { key: '点赞记录', id: 0, isSelect: false },
      { key: '浏览记录', id: 1, isSelect: false }
    ]
    this.tabs[this.select].isSelect=true;
    this.getList(this.select)
  }  
  
  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.getList(index)
  };
  ionViewDidLoad() {
    console.log('ionViewDidLoad StateRecordPage');
  }
  getList(type){
    var url,par;
      if(type){
        console.log('浏览')
        url='/Api/Article/ArticleBrowseList'
      }else{
        console.log('点赞')
        url='/Api/Article/LikeRecordList'
      }
      par={
        ArticleId:this.id,
        PageIndex:1,
        PageSize:100
      }
      this.appService.httpPost(url,par,res=>{
        if(res.Item){
          res.Item.forEach(item => {
            item.CreateTime=this.appService.getNowFormatDate(item.CreateTime,true)
          });
        }
          this.recordList=res.Item;

          console.log(res)
      },true,'')
  }

}
