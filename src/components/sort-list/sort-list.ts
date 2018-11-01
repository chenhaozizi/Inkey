import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService, AppGlobal } from './../../app/app.service';
// import { NavController, NavParams} from 'ionic-angular';


@Component({
  selector: 'sort-list',
  templateUrl: 'sort-list.html'
})
export class SortListComponent {

  @Input() prankingType;// PrankingType:统计类型：0:销售量，1:销售额，2:人气，3:商品浏览，4:顾客飙升，5:分享
  @Input() state; //State:统计范围：0：本店，1：门店，
  @Input() way; //Way:统计方式，0：周，1：月，2：年
  hasmore=false
  ip_src;
  cusarr = [];
  user_token;
  userInfo;


  constructor(public appService: AppService) {
    this.ip_src = AppGlobal.imgsrc;
    console.log('Hello SortListComponent Component')
    this.appService.getItem("user_token", res => {
      this.user_token = res;
    })
    this.appService.getItem("userInfo", res => {
      this.userInfo = res;
    })
  }
  ngOnChanges(changes: SortListComponent) {
    console.log('ngOnChanges中值：' + JSON.stringify(changes));
    if (changes.prankingType || changes.state || changes.way) {
     
      this.getSort();
    }

  }

  getSort() {
    this.cusarr=[];
    if (this.prankingType == 3) {
      let params = {
        "StoreId": this.userInfo.CompanyId,
        "Way": this.way,
        "PageIndex": 1,
        "PageSize": 20
      }
      if (this.state == 0) {
        console.log("本店商品浏览排行")
        this.appService.httpPost('/Api/Home/AppGoodsRankingsList', params, res => {
          console.log('请求的数据：', res)
          this.cusarr = res.Item
        }, true, this.user_token)
        // this.appService.doInit(10,'post','/Api/Home/AppGoodsRankingsList',params,d=>{
        //   console.log("测试下拉刷新获取数据：",d)
        //   this.cusarr = d
        //    this.hasmore =this.appService.hasemore
         
        // })

      } else if (this.state == 2) {
        console.log("全部门店商品浏览记录")
        this.appService.httpPost('/Api/Home/AppStoreGoodRankingList', params, res => {
          console.log('请求的数据：', res)
          this.cusarr = res.Item
        }, true, this.user_token)
        // this.appService.doInit(10,'post','/Api/Home/AppStoreGoodRankingList',params,d=>{
        //   console.log("测试下拉刷新获取数据：",d)
        //   this.cusarr = d
        //    this.hasmore =this.appService.hasemore
         
        // })
      }
    }
    if (this.prankingType !== 3 ) {
      if (this.state == 2) {
        let params = {
          "StoreId": this.userInfo.CompanyId,
          "PrankingType": this.prankingType,
          "State": 1,
          "Way": this.way,
          "PageIndex": 1,
          "PageSize": 20
        }
        this.appService.httpPost('/Api/Home/AppStoreRankingList', params, res => {
          console.log('请求的数据：', res)
          this.cusarr = res.Item
        }, true, this.user_token)
        // this.appService.doInit(10,'post','/Api/Home/AppStoreRankingList',params,d=>{
        //   console.log("测试下拉刷新获取数据：",d)
        //   this.cusarr = d
        //    this.hasmore =this.appService.hasemore
         
        // })

      } else if (this.state !== 2) {
        let params = {
          "StoreId": this.userInfo.CompanyId,
          "PrankingType": this.prankingType,
          "State": this.state,
          "Way": this.way,
          "PageIndex": 1,
          "PageSize": 20
        }
        this.appService.httpPost('/Api/Home/AppRankingsList', params, res => {
          console.log('请求的数据：', res)
          this.cusarr = res.Item
        }, true, this.user_token)
        // this.appService.doInit(10,'post','/Api/Home/AppRankingsList',params,d=>{
        //   console.log("测试下拉刷新获取数据：",d)
        //   this.cusarr = d
        //    this.hasmore =this.appService.hasemore
         
        // })
      }

    }






  }
  //下拉刷型界面
  doRefresh(refresher) {
    this.appService.doRefresh(refresher);
  }
  // 上拉加
  doInfinite(infiniteScroll) {
   this.appService.doMoreload(infiniteScroll)
  }

}
