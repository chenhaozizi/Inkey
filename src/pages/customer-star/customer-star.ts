import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';


/**
 * Generated class for the CustomerStarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-star',
  templateUrl: 'customer-star.html',
})
export class CustomerStarPage {
  num: any = '';
  select = 0;
  public par;
  cusar = [];
  tabs;
  keywords = '';
  init = 0;
  userInfo;
  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService) {
    this.num = navParams.get("num");
    this.cusar = []
    this.tabs = [
      { key: '全部客户', id: 0, isSelect: true },
      { key: '成交客户', id: 1, isSelect: false },
      { key: '意向顾客', id: 2, isSelect: false }
    ]
    this.appService.getItem('userInfo', res => {
      this.userInfo = res
      this.par = {
        PageIndex: 1,
        PageSize: 10,
        StoreId: res.CompanyId,
        State: 0,
        Name: '',
        IsOrderClient: null,
        Grade: null,
      }
    })
  }
  checktab(index: number){
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.chushihua(1)
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerStarPage');
  }
  ionViewWillEnter() {
    this.chushihua(1);
    setTimeout(() => {
      this.init = 0;
      setTimeout(() => {
        this.init = 1
      }, 0);
    }, 0);
    console.log("will", this.init)
  }

  search(){
    // this.keywords=this.keyword 
    console.log(this.keywords)
    this.chushihua(1)
  }
  //下拉刷型界面
  doRefresh(refresher) {
    console.log('下拉刷新');
    this.chushihua(2, refresher);
  }
  //上拉加载更多
  doInfinite(infiniteScroll) {
    console.log('加载更多');
    setTimeout(() => {
      this.chushihua(3,infiniteScroll)
    }, 1000);
  }
  chushihua(askPageType, refreshType?) {
    // askPageType=3 为加载更多  等于1  2  空 为刷新或者初始化
    console.log('顾客父组件分页处理前的参数：', this.par)
    if(this.select == 0){
      this.par.IsOrderClient = this.par.Grade= null;
    }else if (this.select == 1) {
      this.par.IsOrderClient = 1;
      this.par.Grade= null;
    } else if (this.select == 2) {
      this.par.IsOrderClient=null;
      this.par.Grade = 1;
    } 
    this.par.Name = this.keywords;
    this.appService.chushihua('/Api/Customer/GetListPaged', this.par, re => {
      console.log('请求的数据：', re)
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
    }, askPageType, refreshType)
  }

}
