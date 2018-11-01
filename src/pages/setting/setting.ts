import { Component } from '@angular/core';
//  NavController就是用来管理和导航页面的一个controlle
import { IonicPage, ModalController, NavController, NavParams ,App} from 'ionic-angular';
import { LoginPage } from "../login/login";
import { AppService, AppGlobal } from './../../app/app.service';
@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  ip_src;

  user: any = {
    Name: '',
    loginName: '',
    UserType: ''
  }
  loginPage;//定义一个属性
  AboutAppPage;
  ChangePwdPage;
  ChangeUserNamePage;
  mywechatPage; setpage

  //注入一个NavController的实例.
  constructor(public modalCtrl: ModalController, public navCtrl: NavController,public app:App, public navParams: NavParams, public appService: AppService) {
    this.ip_src = AppGlobal.shopsrc;
    this.loginPage = LoginPage;
    this.AboutAppPage = 'AboutAppPage';
    this.ChangePwdPage = 'ChangePwdPage';
    this.ChangeUserNamePage = 'ChangeUserNamePage';
    this.mywechatPage = 'MywechatPage';
    this.setpage = 'SetsPage',
    this.appService.getItem("userInfo", res => {
      console.log(res);
      this.user = res;
    })



  }
  ionViewWillEnter() {
    this.appService.getItem("userInfo", res => {
      console.log(res);
      this.user = res;
    })

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  logOut() {
    this.appService.setItem("user_token", "")
    this.appService.setItem("userInfo", "")
    console.log(window.localStorage.getItem("user_token"))
    this.app.getRootNav().setRoot(LoginPage);
  }
  gologin() {
    console.log("通过代码跳转吧")
    //navCtrl.push(page,{参数}) 后面的集合是一个参数
    this.navCtrl.push('ShopdetailPage', {
      title: '我是上一个页面传过来的参数'
    });

  }
  changeName() {
    console.log("改名按钮")
  }



}
