import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams,AlertController,ToastController,ModalController  } from 'ionic-angular';
import { JPush } from '@jiguang-ionic/jpush';
/**
 * Generated class for the SetsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare let NotificationPlugin: any;  //对变量进行声明
@IonicPage()
@Component({
  selector: 'page-sets',
  templateUrl: 'sets.html',
})


export class SetsPage {
 msgopen ;
  constructor(public navCtrl: NavController,public platform:Platform, public navParams: NavParams,public alertCtrl:AlertController,public Jpush:JPush,public toastCtrl:ToastController,public modalCtrl:ModalController) {
   
  }

  ionViewDidLoad() {
   
    this.msgopen=true;
    console.log('ionViewDidLoad SetsPage');
    if(this.platform.is('cordova')){
      console.log(NotificationPlugin)
      NotificationPlugin.isEnable(function(res){
        console.log(res)
        if(res){
          this.msgopen=true;
        }else{
          this.msgopen=false;
        }
      },function(err){
        console.log(err);
        this.msgopen=false;
      })
    }
  }
  openshow(){
    const modal = this.modalCtrl.create('SetModelPage',{},{ cssClass:'setup_modal'});
    //关闭弹窗返回该页面 再次请求数据 渲染页面
    modal.onDidDismiss(data => {
      // this.getCustomer(this.cusarr.Id)
    });
    modal.present();
  }
  msgpush(){
    console.log(this.msgopen)
    if(!this.msgopen){
      const confirm = this.alertCtrl.create({
        title: '提示',
        message: '关闭消息推送开关后，你将无法收到通知及各种优惠信息，是否确认关闭?',
        buttons: [
          {
            text: '确认',
            handler: () => {
              let toast = this.toastCtrl.create({
                message: '您已关闭消息推送功能 ',
                duration: 1500
             });
             toast.present();
              this.Jpush.stopPush();
              console.log('Disagree clicked');
            }
          },
          {
            text: '再想想',
            handler: () => {
              this.msgopen=true
            }
          }
        ]
      });
      confirm.present();
    }else{
      this.Jpush.resumePush();
    }
  }
}
