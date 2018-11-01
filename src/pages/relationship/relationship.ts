import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService,AppGlobal } from "../../app/app.service";
/**
 * Generated class for the RelationshipPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-relationship',
  templateUrl: 'relationship.html',
})
export class RelationshipPage {
  public tabs;
  public select = 0;
  public keywords='';
  cusarr;
  cusdetailPage;
  ip_src;
  id;//顾客id
  user_token;
  type=1;//请求上下级类型 0：下级 1：上级
  constructor(public navCtrl: NavController, public navParams: NavParams,public appservice:AppService) {
    this.ip_src = AppGlobal.shopsrc;
    this.id=this.navParams.get('id');
    this.appservice.getItem("user_token",res=>{
      this.user_token=res;
    });

    console.log('接收到的客户Id:',this.id)

    this.cusdetailPage = 'CustomerInfoPage';

    this.tabs = [
      { key: '我的上级', id: 0, isSelect: true },
      { key: '我的下级', id: 1, isSelect: false }
    ]
  }
  checktab = function (index: number) {
    console.log("index" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    index===0?this.type=1:this.type=0;
    console.log('请求上下级的type：',this.type)
    this.getRelationship(this.id,this.type,this.keywords);
  };
  ngOnInit(){
    console.log("发起请求")
    this.getRelationship(this.id,this.type,'');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad RelationshipPage');
  }
  getRelationship(id:number,type:number,name:string){
    let parame={'CustomerId':id,'Type':type,'Name':name,'PageIndex':1,'PageSize':10}
    this.appservice.httpPost('/Api/Customer/GetConnection',parame,res=>{
      console.log('返回的关系数据：',res);
      if(res.Item){
        this.cusarr=res.Item;
      }else{
        this.cusarr=[];
      }
    },false,this.user_token)
  }
  keywordsc(){
    if(this.type==0){
      this.getRelationship(this.id,this.type,this.keywords)
    }else{
      this.keywords='';
    }
    console.log(this.keywords)

  }

  // ngOnChanges(changes:RelationshipPage):void {
  //   console.log('ngOnChanges中值：' + JSON.stringify(changes));
  // }
}
