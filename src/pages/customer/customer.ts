import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { AppStorage } from '../../app/storage.service';
import { CustomersPage } from '../customers/customers';
import { CustomerAutoPage } from "../customer-auto/customer-auto"//自然到店顾客
import { AppService } from "../../app/app.service"
import {CustomerStarPage} from '../customer-star/customer-star'
/**
 * Generated class for the CustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html'
})
export class CustomerPage {
  customersPage;
  customerStarPage;
  customerAutoPage;
  items = [];
  cusdetailPage;
  cusar = [];
  numAll;//最近访客总数
  keywords;
  init=0;
  userInfo;
  par;
  constructor(public navCtrl: NavController, public navParams: NavParams, public appstorage: AppStorage, public appService: AppService) {
    this.customersPage = CustomersPage;
    this.customerStarPage = CustomerStarPage;
    this.customerAutoPage = CustomerAutoPage;
    this.cusdetailPage = 'CustomerInfoPage';
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

  ionViewWillEnter(){
    this.chushihua(1);
    setTimeout(() => {
      this.init=0;
      setTimeout(() => {
        this.init=1
      }, 0);
    }, 0);
    console.log("will",this.init)
  }

  toggleFun() {
    this.par.Name=this.keywords;
    console.log(this.keywords)
  }

  getData(msg: any) {
    console.log('我是来自子组件的数据', msg);// 接收到的数据
    this.numAll = msg.numAll;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerPage');
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
    console.log('顾客父组件分页处理后的参数：',this.par)
  }

  
}





