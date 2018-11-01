import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { AppService } from './../../app/app.service';
/**
import {OrderBy} from "../../pipes/order-by/order-by"
/**
import {OrderBy} from "../../pipes/order-by/order-by"
/**
 * Generated class for the CustomersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customers',
  templateUrl: 'customers.html',
})
export class CustomersPage {
  title: string = '';
  num: any = '';
  type: any = '';
  public tabs;
  public par;
  select = 0;
  cusar=[];
  cusdetailPage;

  keywords='';
  init=0;
  userInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams,public appService: AppService) {
    this.type = navParams.get("type");
    this.cusdetailPage='CustomerInfoPage';
    if(this.type==0){console.log(`全部访客`)}else if(this.type==1){console.log(`本周访客`)}
    this.title = navParams.get('title');
    this.num = navParams.get("num");
    this.tabs = [
      { key: '时间近', id: 0, isSelect: true },
      { key: '逛店多', id: 1, isSelect: false },
      { key: '转发多', id: 2, isSelect: false },
      { key: '带客多', id: 3, isSelect: false }
    ]
    this.appService.getItem('userInfo',res=>{
      this.userInfo=res
      this.par={
        PageIndex: 1, 
        PageSize:10,
        StoreId: this.userInfo.CompanyId, 
        Type: 0, 
        State: 0,
        Name:''
      }
    })
  }
  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.chushihua(1)
  };
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomersPage');
  }
  search(){
    // this.keywords=this.keyword 
    console.log(this.keywords)
    this.chushihua(1)
  }

  ionViewWillEnter(){
    this.chushihua(1)
    setTimeout(() => {
      this.init=0;
      setTimeout(() => {
        this.init=1
      }, 0);
    }, 0);
    console.log("will",this.init)
  }
   //下拉刷型界面
   doRefresh(refresher) {
    console.log('下拉刷新');
    this.chushihua(2,refresher);
  }
  //上拉加载更多
  doInfinite(infiniteScroll) {
    console.log('加载更多');
    setTimeout(() => {
      this.chushihua(3,infiniteScroll)
    }, 1000);
  }

  chushihua(askPageType,refreshType?){
    // askPageType=3 为加载更多  等于1  2  空 为刷新或者初始化
      console.log('顾客父组件分页处理前的参数：',this.par)
      this.par.Type=this.select;
      this.par.Name=this.keywords;
      this.appService.chushihua('/Api/Home/GetLastVisitorsList',this.par,re=>{
        console.log('请求的数据：',re)
        if (askPageType == 1 || askPageType == 2) {
          this.cusar = re.Item
        } else if (askPageType == 3) {
          console.log('加载当前页面', this.par.PageIndex)
          this.cusar = this.cusar.concat(re.Item);
          if (this.cusar.length == re.Pagination.TotalCount) {
            console.log("请求完所有数据");
            this.par.PageIndex = re.Pagination.PageCount
          }
        }
     },askPageType,refreshType)
  }

}
