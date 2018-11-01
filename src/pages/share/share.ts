import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, Item } from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import { AppService, AppGlobal } from './../../app/app.service';
// import {AddactivePage} from "../addactive/addactive";
/**
 * Generated class for the SharePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
  items = [];
  shareinfoPage;
  ip_src = AppGlobal.imgsrc;
  actList: any = [];
  imgleng;
  hasmore = true;
  run = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
  result;
  bugg = false;
  addactivepage;
  keywords='';
  par = {
    PageIndex: 1,
    PageSize: 10,
    Title:''
  }
  constructor(public navCtrl: NavController, public appService: AppService, public modalCtrl: ModalController,
    public navParams: NavParams, public appShare: AppShare, public actionSheetCtrl: ActionSheetController) {
    this.shareinfoPage = 'ShareinfoPage';
    this.addactivepage = 'AddactivePage';
    //this.result=this.chushihua(this.par,1);
    console.log(this.ip_src)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
    this.chushihua(1)
  }
  //下拉刷型界面
  doRefresh(refresher) {
    this.chushihua(1,refresher)
  }
  // 上拉加载更多
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.chushihua(3,infiniteScroll)
    }, 1000);
  }
 chushihua(askType,a?){
   console.log('刷新事件',a)
   this.par.Title=this.keywords
   this.appService.chushihua('/Api/Article/GetListPaged',this.par,d=>{
     console.log('获取的res',d)
     d.Item.forEach(item => {
      item.ImagesPic = item.ImagesPic.slice(0, 3);
      if (item.CreateUserType) {
        item.CreateUserType = '店长'
      } else {
        item.CreateUserType = '导购'
      }
    })
    if (askType == 1 || askType == 2) {
      this.actList = d.Item
    } else if (askType == 3) {
      console.log('加载当前页面', this.par.PageIndex)
      this.actList = this.actList.concat(d.Item);
      if (this.actList.length == d.Pagination.TotalCount) {
        console.log("请求完所有数据");
        this.par.PageIndex = d.Pagination.PageCount
        this.hasmore = false
      } else {
        this.hasmore = true
      }
    }
    console.log('当前数量：',this.actList.length,'服务器总数：', d.Pagination.TotalCount)
   },askType,a)
 }
 search(){
  // this.keywords=this.keyword 
  console.log(this.keywords)
   this.chushihua(1)
}
}




