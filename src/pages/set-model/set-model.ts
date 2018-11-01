import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,Platform} from 'ionic-angular';
import{NativeService} from '../../providers/NativeService'
declare let NotificationPlugin: any;  //对变量进行声明
/**
 * Generated class for the SetModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-model',
  templateUrl: 'set-model.html',
})
export class SetModelPage {
  isios=true;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public platform:Platform,public nativeService:NativeService) {
  if(this.nativeService.isAndroid()){
    this.isios=false
  }else if(this.nativeService.isIos()){
    this.isios=true
  }else{
    this.isios=false
  }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetModelPage');
  }
  goset(){
    this.viewCtrl.dismiss();
   try{
     if(this.nativeService.isAndroid()){
          //安卓去打开消息通知栏
          NotificationPlugin.openNotification(function(suc){
              console.log(suc)
              if(suc){
                  console.log('通知栏打开');
              }
          },function(err){
              console.log('通知栏打开')
          });
      }
 }catch(err){
     console.log('设置操作异常',err)
  }
  }
}
