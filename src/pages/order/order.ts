import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AppService,AppGlobal } from '../../app/app.service';
let tabs =[{ key: '全部', id: '', isSelect: true },
{ key: '待付款', id: 0, isSelect: false },
{ key: '已完成', id: 2, isSelect: false }];
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  
  public cusarr=[];
  public  categoryData=[];
  public select =0;token;par={
    'Status':0,
    'PageIndex':1,
    'PageSize':100,
    'CustomerName':''
  }
 ip_src = AppGlobal.shopsrc;keywords='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public appService:AppService) {
    this.categoryData  =tabs;
    this.select = 0;
    
    console.log( this.categoryData)
  }
  checktab = function (index: number) {
    console.log("index" + index);
    this.categoryData[this.select].isSelect = false;
    let data = this.categoryData[index];
    data.isSelect = true;
    this.select = index;
    console.log(this.categoryData[index].id)
      this.getList(this.categoryData[index].id)
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    this.getList('')
  }
  selectedFriends(index) {
    console.log("Segment changed to", index);
  }
  getList(type){
     this.par.Status=type
    this.appService.getItem('user_token',res=>{
      this.token=res
    })
    this.appService.httpPost('/Api/Orders/GetOrderMasterListPaged',this.par,res=>{
      console.log(res)
      res.Item.forEach(el => {
        if(el.Status==0){
          el.StatusDes = '待付款'
        }
        el.CreateTime = this.appService.getNowFormatDate(el.CreateTime,true)
      });
      this.cusarr = res.Item;
    },false,this.token)
   
  }
  getItems(e){
      console.log(this.keywords)
      if(this.keywords){
          this.par.CustomerName=this.keywords;
          this.getList('')
      }
  }
}
