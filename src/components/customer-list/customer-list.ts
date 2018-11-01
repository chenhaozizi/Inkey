import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppService } from "../../app/app.service";
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomerListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

// "Type": 0,          Type:筛选类型，0：时间近，1：逛店多，2：转发多，3：代客多,
// "State": 0,          State:0:全部顾客，1：本周顾客,
// "Name": "string",    Name:搜索名字
// "StoreId": '',
// "PageIndex": 1,
// "PageSize": 10,


@Component({
  selector: 'customer-list',
  templateUrl: 'customer-list.html'
})
export class CustomerListComponent {
  @Input() init;
  @Input() cusar=[];
  @Input() showType='';
  @Input() parentPage='';
  @Output() private childOuter = new EventEmitter();//子传
  item = [];
  cusdetailPage;
  constructor(public appService: AppService, public navController: NavController, public navParams: NavParams) {
    console.log('进入顾客组件');
    this.cusdetailPage = 'CustomerInfoPage';
  }
  ngOnChanges(changes: CustomerListComponent) {
    this.cusar.forEach(item => {
      if(item.CreateTime){
        item.CreateTime=this.appService.getNowFormatDate(item.CreateTime,true)
      }
    });
    // console.log(this.showType)
    // console.log(this.parentPage)
    for (let propName in changes) {
      /*let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      this.changeLog.push(`propName: currentValue = cur, previousValue = prev`);*/
    }
  }
}
