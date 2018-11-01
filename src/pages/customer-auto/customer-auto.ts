import { AppService } from './../../app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController} from 'ionic-angular';
import { ModalTemplatePage } from "../modal-template/modal-template";




/**
 * Generated class for the CustomerAutoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer-auto',
  templateUrl: 'customer-auto.html',
})
export class CustomerAutoPage {
  init=1;
  cusar =[];
  numAll;
  par;
  userInfo;
  keywords='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public appService:AppService) {
    this.appService.getItem('userInfo',res=>{
      this.userInfo=res
      this.par = {
        IsManuallyAdd: 1,
        PageIndex: 1,
        PageSize: 10,
        Name:''
      }
    })
  }
  ionViewDidLoad() {console.log('ionViewDidLoad CustomerAutoPage') }
  addCustomer() {
    const modal = this.modalCtrl.create(ModalTemplatePage,{'title':'新增顾客','type':1});
    modal.onDidDismiss(data => {
      console.log(data);
      if(data.status==true){
        this.chushihua(1)
      }else{
        this.appService.toast('添加失败，请稍后再试')
      }
    });
    modal.present();
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
      this.par.Name=this.keywords;
      console.log('顾客父组件分页处理前的参数：',this.par)
      this.appService.chushihua('/Api/Customer/GetListPaged',this.par,re=>{
        console.log('请求的数据：',re)
        if (askPageType == 1 || askPageType == 2) {
          this.cusar = re.Item
        } else if (askPageType == 3) {
          console.log('加载当前页面', this.par.PageIndex)
          this.cusar = this.cusar.concat(re.Item);
          if (this.cusar.length >= re.Pagination.TotalCount) {
            console.log("请求完所有数据");
            this.cusar.slice(0,re.Pagination.TotalCount)
            this.par.PageIndex = re.Pagination.PageCount
          }
        }
     },askPageType,refreshType)
  }
}
