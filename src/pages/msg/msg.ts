import { AppService } from './../../app/app.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Item } from 'ionic-angular';

/**
 * Generated class for the MsgPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msg',
  templateUrl: 'msg.html',
})
export class MsgPage {
  msgInfoPage;
  user_token;
  item = [];
  tit='通知';
  isShowDeleteChoose: boolean = false;//是否显示单个通知的勾选框 和 '清空'按钮的显示
  isFristShow: boolean = true;
  delete_items = [];
  tabs = [];
  select = 0;                 //临时储存需要删除的id集
  init = 0;
  hasmore = false;
  par;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public appService: AppService) {
    this.msgInfoPage = 'MsgInfoPage';
    this.par= {
      MessageType:this.select+1,
      PageIndex: 1,
      PageSize: 15
    }
    this.tabs = [
      { key: '通知', id: 0, isSelect: true },
      { key: '消息', id: 1, isSelect: false }
    ]
    this.appService.getItem("user_token", res => {
      this.user_token = res;
    })
  }
  ionViewWillEnter() {
    // console.log("will", 'select:', this.select)
    this.getMsg(this.select + 1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgPage');
  }
  // ngOnInit() {
  //   this.getMsg(1);
  // }
  //切换菜单
  checktab = function (index: number) {
    console.log("index:" + index);
    this.tabs[this.select].isSelect = false;
    let data = this.tabs[index];
    data.isSelect = true;
    this.select = index;
    if(this.select==0){
      this.tit="通知"
    }else{
      this.tit="消息"
    }
    this.getMsg(1);
    this.isShowDeleteChoose = false;
    this.isFristShow = true;
    this.delete_items=[];
  };
  // 获取消息
  getMsg(askType,refresh?) {
    this.par.MessageType=this.select+1;
    this.appService.chushihua('/Api/Home/GetMessageList',this.par,d=>{
      console.log("返回的数据：",d)
      if(d.Item){
        d.Item.forEach(itm => {
          itm.CreateTime = this.appService.getNowFormatDate(itm.CreateTime, false)
        });
      }
      if (askType == 1 || askType == 2) {
        this.item = d.Item
      } else if (askType == 3) {
        console.log('加载当前页面', this.par.PageIndex)
        this.item = this.item.concat(d.Item);
        if (this.item.length >= d.Pagination.TotalCount) {
          console.log("请求完所有数据");
          this.par.PageIndex = d.Pagination.PageCount
          this.hasmore = true
        }
      }
      console.log('当前数量：',this.item.length,'服务器总数：', d.Pagination.TotalCount)
    },askType,refresh)
  }
  //初始化
  
  //多条删除
  deleteFuction() {
    if (this.isFristShow == true) {
      this.isShowDeleteChoose = true;
      this.isFristShow = false;
    } else {
      console.log('删除项目大小：', this.delete_items.length)
      if (this.delete_items.length == 0) {
        this.isShowDeleteChoose = false;
        this.isFristShow = true;
      }
      if (this.delete_items.length > 0) {
        const confirm = this.alertCtrl.create({
          title: '提示',
          message: '删除选中的通知吗？',
          buttons: [
            {
              text: '取消',
              handler: () => {
                this.isShowDeleteChoose = false;
                this.isFristShow = true;
                this.delete_items = [];
              }
            },
            {
              text: '删除',
              handler: () => {
                for (let i = 0; i < this.delete_items.length; i++) {
                  this.delMsg(this.delete_items[i]);
                }
                this.isShowDeleteChoose = false;
                this.isFristShow = true;
                this.delete_items = [];
              }
            }
          ]
        });
        confirm.present();
      };

    }
  }
  //删除消息的复选框添加到一个数组
  delete(id: number) {
    console.log('当前选中的通知Id：', id)
    if (this.delete_items.indexOf(id) !== -1) {
      console.log(this.delete_items.indexOf(id));
      this.delete_items.splice(this.delete_items.indexOf(id), 1)
    } else {
      this.delete_items.push(id);
    }
    console.log('将要删除的Ids:', this.delete_items)
  }
  //删除通知
  delMsg(id: number) {
    console.log('删除Id:', id)
    let params = { 'pushMessageId': id }
    this.appService.httpGet('/Api/Home/DeleteMessage', params, res => {
      if (res) {
        this.getMsg(this.select + 1);
      }
    }, false, this.user_token)
  }
  //取消删除操作
  cancelDel() {
    this.isShowDeleteChoose = false;
    this.isFristShow = true;
    this.delete_items = [];
  }
  readAll(){
    console.log("已经全读了")
    let par={
      MessageType: this.par.MessageType,
    }
    console.log(par);
    this.appService.httpPost('/Api/Home/ReadAll',par,res=>{
      console.log(res)
      console.log("当前select",this.select)
      this.getMsg(1);
      this.isShowDeleteChoose = false;
      this.isFristShow = true;
      this.delete_items = [];
    },true)

  }
  //下拉刷型界面
  doRefresh(refresher) {
   this.getMsg(1,refresher)
  // 上拉加
  }
  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.getMsg(3,infiniteScroll)
    }, 1000);
  }
}
