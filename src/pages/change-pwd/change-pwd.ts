import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController,App } from 'ionic-angular';
import { AppService } from "../../app/app.service";
import { LoginPage } from '../login/login';
let self = this;

/**
 * Generated class for the ChangePwdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-pwd',
  templateUrl: 'change-pwd.html',
})
export class ChangePwdPage {
  phone = '';//手机号
  yzm = '';//验证码
  password = '';//新密码
  hadSendMsg = false;
  tim;
  timerout = 60;//验证码的发送时间间隔
  isShowTimeOut = false;
  interval;
  title='';
  ifuptel=false;
  oldphone;//旧手机号
  newphone;//新手机号
  telflag;
  constructor(public navCtrl: NavController, public navParams: NavParams,public app:App, public alertCtrl: AlertController, public appService: AppService) {
    self = this;
    this.tim = this.timerout;//验证码
    this.appService.getItem("userInfo",res=>{
      this.oldphone=res.Phone;
      this.phone = res.Phone
    })
  }
  ionViewWillEnter() {

  }
  ionViewDidLoad() {
    let tel = this.navParams.get('tel');
    this.telflag = tel;
    if(tel){
      this.title='修改电话号码'
      this.ifuptel=true;
    }else{
      this.title="修改密码"
      this.ifuptel=false
    }
    console.log('ionViewDidLoad ChangePwdPage');
  }

  // 获取验证码
  getYzm() {
   let len;let parTel;
   if(this.telflag){
     len = this.newphone.length
     parTel=this.newphone
     }else{
    len=this.phone.length
    parTel=this.phone
     }
    if (len == 11) {
      console.log(this.phone,parTel)
      if (this.hadSendMsg == false) {
        let params = {
          "SMStype": 1,
          "Phone":parTel
        }
        this.appService.httpPost('/Api/Home/Sends', params, res => {
          if (res) {
            this.showAlert('验证码已发送至手机，请注意查收。')
            this.hadSendMsg = true;
            this.timeDown(this.timerout);

          }
        }, true, '')
      }

    } else {
      this.showAlert('请输入正确的11位数新手机号码')
    }

  }
  // 获取验证码的定时控制
  timeDown(time: number) {
    if (this.tim == this.timerout) {
      this.isShowTimeOut = true;//显示时间倒计时
      this.interval = setInterval(function () {
        time--;
        self.tim = time
        if (time == 0) {
          time = self.timerout;
          self.tim = self.timerout;
          self.isShowTimeOut = false;
          self.hadSendMsg = false;
          clearInterval(self.interval)
        }
        console.log('获取验证码的间隔时间：', self.timerout, time, '多少时间后可用:', self.tim)
      }, 1000)
    }

  }
  showAlert(message,cb?) {
    const alert = this.alertCtrl.create({
      title: "提示",
      subTitle: message,
      buttons: [{
        text: "好的",
        handler: data => {
          if(cb)             cb();

        }
    }]
    });
    alert.present();
  }
  changePwd() {
    console.log('电话：', this.phone, '验证码：', this.yzm, '新密码：', this.password)
    if (this.phone.length !== 11) {
      this.showAlert('电话号码有误，请重新输入')
      return;
    } else if (this.yzm.length !== 6) {
      this.showAlert('请输入正确的6位验证码')
      return;
    } else if (this.password == '') {
      this.showAlert('请输入正确的新密码')
      return;
    } else {
      this.chPwd();
    }
  }
  changeTel() {
    console.log('电话：', this.oldphone, '验证码：', this.yzm, '新密码：', this.newphone)
    if (this.newphone.length !== 11) {
      this.showAlert('电话号码有误，请重新输入')
      return;
    } else if (this.yzm.length !== 6) {
      this.showAlert('请输入正确的6位验证码')
      return;
    }else {
      this.chTel();
    }

  }
  chTel(){
    let pam = {
      "Verificode": this.yzm,
      "Phone": this.newphone
    }
    this.appService.httpPost('/Api/User/ModifyPhone', pam, res => {

      if (typeof(res)=='string' && res.length!=2) {
        this.showAlert(res)
      }else{
        this.appService.getItem('userInfo',res=>{
          res.Phone = this.newphone;
          this.appService.setItem('userInfo',res);
          this.showAlert('修改成功',res=>{
            this.navCtrl.pop()
          })
        })
        
        
      }
    }, true, '')
  }
  //调用修改密码API
  chPwd(){
    let pam = {
      "Password": this.password,
      "Verificode": this.yzm,
      "Phone": this.phone
    }
    this.appService.httpPost('/Api/User/ForgetPassword', pam, res => {
      console.log('修改密码：',)

      if (typeof(res)=='string' && res.length!=2) {
        this.showAlert(res)
      }else{
        this.showAlert('密码操作成功，将返回登录界面',res=>{
          this.app.getRootNav().setRoot(LoginPage);
        })
        
      }
    }, true, '')

  }

}
