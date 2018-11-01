import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';

/**
 * 
 * Generated class for the SortinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sortinfo',
  templateUrl: 'sortinfo.html',
})
export class SortinfoPage {
  public tabs;
  public title;
  public select = 0;
  public par;
  public params;
  public type = "导购";
  public flag = true;
  public cusarr = [];
  unit;
  isDG = true;

  prankingType = 2;//统计类型：0:销售量，1:销售额，2:人气，3:商品浏览，4:顾客飙升，5:分享
  state = 1;// 默认 1：全国门店导购   统计范围：0：本店导购，1：全国门店导购,2:全国门店排行
  way = 0;// 默认 0：周               Way:统计方式，0：周，1：月，2：年

  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService) {
    this.title = this.navParams.get("title") || '详情';
    this.unit = this.navParams.get("unit") || '';
    this.prankingType = this.navParams.get('prankingType') || '';
    if (this.prankingType == 3) {
      this.isDG = false;
      this.state = 0;
    } else {
      this.isDG = true;
      this.state = 1
    }
    this.tabs = [
      { key: '周', id: 0, isSelect: true },
      { key: '月', id: 1, isSelect: false },
      { key: '年', id: 2, isSelect: false }
    ]
    this.par = {
      id: 1
    }
    this.params = {
      pageNo: 1,
      favoritesId: 0,
    }

  }
  changetitle(state: number) {
    console.log('state统计范围  0：本店，1：门店  ', state)
    this.state = state;
  }

  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.way = index;
  };
  ionViewDidLoad() {
    console.log('ionViewDidLoad SortinfoPage');
  }
}
