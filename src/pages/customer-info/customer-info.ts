import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ModalTemplatePage } from "../modal-template/modal-template";
import { AppService, AppGlobal } from "../../app/app.service";
/**
 * Generated class for the CustomerInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let storId;
@IonicPage()
@Component({
  selector: 'page-customer-info',
  templateUrl: 'customer-info.html',
})
export class CustomerInfoPage {
  public tabs;
  public select = 0;
  public cusarr: any = { name: 'Anna' };
  public id;
  public relation;
  public seegoodslist;
  public buygoodslist;
  public ip_src;
  token;GoodsDetailPage;shareinfoPage
  seegoodslistlen;
  oldcus = false;
  intent = false;seeArticlist;seeactivelist;acinfopage;seecolllist
  changeView = false;//控制  看过的买家秀或者看过的商品
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public appService: AppService) {
    this.GoodsDetailPage='GoodsDetailPage';
    this.shareinfoPage = 'ShareinfoPage';
    this.acinfopage = 'ActiveInfoPage';
    this.ip_src = AppGlobal.shopsrc;
    this.relation = 'RelationshipPage';
    this.tabs = [
      { key: '看过的商品', id: 0, isSelect: true },
      { key: '看过的盈客圈', id: 1, isSelect: false },
      { key: '看过的促销', id: 2, isSelect: false },
      { key: '看过的拼团', id: 3, isSelect: false }
    ]

    this.appService.getItem("user_token", res => {
      this.token = res
    })
    this.appService.getItem('userInfo', res => {
      storId = res.CompanyId;
    })
    this.id = this.navParams.get("id");
    console.log('客户Id:', this.navParams.get("id"))

    this.getCustomer(this.id);
    this.getSeegoodList(this.id, 0)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomerInfoPage');
  }
  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    this.getSeegoodList(this.id, index)
  };
  //修改顾客备注名
  changeRemark(id: number) {

    const modal = this.modalCtrl.create(ModalTemplatePage, { 'title': '修改备注名', 'type': 2, "id": this.cusarr.Id });
    //关闭弹窗返回该页面 再次请求数据 渲染页面
    modal.onDidDismiss(data => {
      this.getCustomer(this.cusarr.Id)
    });
    modal.present();
  }
  // 请求客户信息
  getCustomer(id: number) {
    this.appService.httpGet('/Api/Customer/GetCustomerById', { customerId: id }, res => {
      if (res) {
        console.log('请求的客户详细信息', res)
        //sex 0:女  1：男
        console.log('客户性别：', res.Item.Sex)
        console.log('客户最后登录时间：', res.Item.LastLoginTime)
        if (res.Item.Sex == 1) {
          res.Item.Sex = '../../assets/imgs/man.png'
        } else if (res.Item.Sex == 2) {
          res.Item.Sex = '../../assets/imgs/women.png'
        } else {
          res.Item.Sex = '';
        }
        res.Item.LastLoginTime = this.appService.getNowFormatDate(res.Item.LastLoginTime, true)
        this.cusarr = res.Item
      } else {
        console.log("token无效")
      }
    }, false, '')

  }
  getSeegoodList(id, type) {
    var url;
    if (type==1) {
      url = "/Api/Customer/GetCustomerBrowseArticleList"
    }else if(type == 2){
      console.log("看过的活动")
      url='/Api/Customer/GetCustomerBrowseActivityList'
    } else if(type == 3){
      url = '/Api/Customer/GetCustomerBrowseCollageList'
    }else{
        url="/Api/Customer/GetCustomerBrowseGoodsList"
    }
    console.log(url)
    console.log(storId)
    var par = {
      'CustomerId': id,
      'StoreId': storId,
      'PageIndex': 1,
      'PageSize': 5
    }
// if(type){
//   this.seegoodslist=[
//     {
//      'GoodsImg': '/Files/KindEditor/20180917/20180917143841_2129.jpg',
//      'GoodName':'粤派家具市场进入整合洗牌期',
//      'SpecDes':''
//     },
//     {
//       'GoodsImg': '/Files/KindEditor/20180917/20180917144415_2231.jpg',
//       'GoodName':'四股资本力量搅动家居行业，全屋定制成蓝海',
//       'SpecDes':''
//      },
//      {
//       'GoodsImg': '/Files/KindEditor/20180917/20180917155018_3221.jpg ',
//       'GoodName':'定制家具价格怎么计算比较合理',
//       'SpecDes':''
//      }
//   ]
// }else{
    this.appService.httpPost(url, par, res => {
      console.log(res)
      if (res) {
        if(type == 1){
          this.seeArticlist=res.Item;
          this.seegoodslistlen = res.Item.length
        }else if(type == 2){
          this.seeactivelist = res.Item;
          this.seegoodslistlen = res.Item.length
        }else if(type == 3){
          this.seecolllist = res.Item;
          this.seegoodslistlen = res.Item.length
        }else{
          this.seegoodslist = res.Item;
          this.seegoodslistlen = res.Item.length
        }
        
      } else {
        console.log("token无效")
      }
    }, false, '')
  }
  //}
  //更改意向或者老客户状态

  changetype(type, value: number) {
    console.log("修改的是：",type,"当前值是:",value)
    var pardate;
    if (type == 1) {//意向顾客
      value == 0 ? this.cusarr.Grade = 1 : this.cusarr.Grade = 0;
      pardate = {
        'customerId': this.cusarr.Id,
        'Grade': this.cusarr.Grade
      }
      this.update('/Api/Customer/ModifyCustomer', pardate)
    }

    if (type == 2) {//老顾客
      value == 0 ? this.cusarr.IsOrderClient = 1 : this.cusarr.IsOrderClient = 0;
      pardate = {
        'customerId': this.cusarr.Id,
        'IsOrderClient': this.cusarr.IsOrderClient
      }
      this.update('/Api/Customer/ModifyCustomerClient', pardate)
    }
  }
  update(url, data) {
    this.appService.httpGet(url, data, res => {
      if (res) {
        //刷新数据
        this.getCustomer(this.id);
      } else {
        console.log("token无效")
      }
    }, false, this.token)
  }
}
