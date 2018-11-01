import { Component } from '@angular/core';
//NavParams 接收上一页面传递的参数
import {Platform, IonicPage, ModalController, NavParams, NavController, AlertController } from 'ionic-angular';

import { TabsPage } from "../tabs/tabs";
import { AppService } from './../../app/app.service';
import { JPush } from '@jiguang-ionic/jpush'; 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public par;
  title: string;//定义一个变量，并声明类型
  sequence:1;
  changePwdPage;
  //实例化
  constructor(public modalCtrl: ModalController,public alertCtrl: AlertController,public params: NavParams, public navCtrl: NavController, public appService: AppService,public jpush:JPush,public platform:Platform) {
    this.changePwdPage='ChangePwdPage';
  }
  //返回到上一个界面
  pushHomePage() {
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    console.log("测试账号：DG004  密码:123456")
    console.log('ionViewDidLoad LoginPage');
  }

  logIn(username: HTMLInputElement, password: HTMLInputElement) {
    if (username.value.length == 0) {
      this.showAlert("请输入正确的用户名")
    } else if (password.value.length == 0) {
      this.showAlert("请输入密码")

    } else {
      this.par = {
        LoginName: username.value,
        Password: password.value
      }
      this.appService.httpPost('/Api/User/Login', this.par, d => {
        console.log(typeof(d))
        if (typeof(d) == 'string') {
          console.log('登录失败')
          this.showAlert(d)
          return
        }
        var id= 'u_'+ d.Item.UserResponse.Id;
       
        if(this.platform.is('cordova')){
        this.jpush.setAlias({ sequence: 1, alias:id}).then(res=>{
          
          console.log('检查设置别名',res)
        })
        .catch(res=>{
          console.log(res,'设置别名出错')
        });
      }
       
        //存储用户数据
        if(d.Item.UserResponse.Logo){
          d.Item.UserResponse.Logo=d.Item.UserResponse.Logo.replace('middle','')
        }
        if(d.Item.UserResponse.WxQRCode){
          d.Item.UserResponse.WxQRCode=d.Item.UserResponse.WxQRCode.replace('middle','')
        }
        this.appService.setItem("userInfo", d.Item.UserResponse);
        //缓存token
        this.appService.setItem("user_token", d.Item.Token);
        //缓存过期时间
        this.appService.setItem("oldtime", d.Item.ExpireTime);
        this.appService.getItem("userInfo", res => {
          console.log("缓存的用户信息", res)
          this.navCtrl.setRoot(TabsPage);
        })
        this.appService.getItem("user_token", res => {
          console.log("缓存的token", res)
        })
        this.appService.getItem("oldtime", res => {
          console.log("缓存的oldtime", res)
        })
      }, false, '');

    }
  }
  showAlert(message) {
    const alert = this.alertCtrl.create({
      title: "提示",
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}

