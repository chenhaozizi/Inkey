import { Component ,ViewChild} from '@angular/core';
import { Platform ,Keyboard, IonicApp,Nav,ToastController,App,NavController,Events,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login'
import { TabsPage } from '../pages/tabs/tabs';
import { NativeService  } from '../providers/NativeService';
import { JPush } from '@jiguang-ionic/jpush';
import {JpushUtil} from '../providers/JpushUtil';
import { Device } from '@ionic-native/device';
import { Badge } from '@ionic-native/badge';
// import {  SettingPage  } from '../pages/setting/setting';
// import { SortinfoPage } from '../pages/sortinfo/sortinfo';
import { AppService } from './app.service';
declare let cordova:any;let self;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  token;
  oldtime;
  showToast;
  public registrationId: string;
  devicePlatform: string;
  sequence: number = 0;
  backButtonPressed: boolean = false;// 返回键是否已触发
  @ViewChild(Nav) nav: Nav;
  @ViewChild('appNav') private navCtrl: NavController;
  constructor(private platform: Platform, statusBar: StatusBar,
    private toastCtrl: ToastController,
    public keyboard: Keyboard,
    public ionicApp: IonicApp,
    public nativeService:NativeService,
    public jpush: JPush, device: Device,
    public JpushUtil:JpushUtil,
    public app:App,
    public badge:Badge,
    public events:Events,
    
    splashScreen: SplashScreen,public appService:AppService) {
     self=this;
    this.appService.getItem("user_token",res=>{
        this.token=res
    });
    this.appService.getItem("oldtime",res=>{
        this.oldtime=res
    });
    if(this.appService.checktoken(this.token,this.oldtime)){
      console.log('已经登录了')
      // this.navCtrl.setRoot(TabsPage)
     this.rootPage=TabsPage;
      }  else  {
        console.log("未登录")
    this.rootPage=LoginPage;
     // self.navCtrl.setRoot(LoginPage)
     
      this.appService.setItem("user_token","");
      this.appService.setItem("oldtime","");
      this.appService.setItem("userInfo","");
    }
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      events.subscribe('toLogin',()=>{
        console.log('token过期。。。。。。。。。。。。。。。。。。。。。。。。。')
        this.appService.alert('登录过期,重新登录',res=>{
          this.app.getRootNav().setRoot(LoginPage);
        })
       console.log(this.navCtrl)
      })
      // 注册返回按键事件
      this.registerBackButtonAction();//注册返回按键事件
      this.nativeService.checkpermiss();//检测更新
            /**极光推送开启 */
    if(this.platform.is('cordova')){
        this.jpush.setDebugMode(true);
        console.log("进入推送")
        this.jpush.init().then(res=>console.log(res)).catch(err=>console.log(err));//插件初始化
        this.jushinit();
        var id;
        if(this.token){
        this.appService.getItem('userInfo',res=>{
            id='u_'+res.Id;
            let tag='t_'+res.CompanyId+'_'+res.UserType 
            
        })
        console.log(id)
         this.jpush.setAlias({ sequence: 1, alias:id});
        }    //设置别名user.userCode
    }else{
        console.log('cordova不阔以用')
    }
    });
  }
  ionViewDidLoad() {
    console.log(this.navCtrl)
  }
  registerBackButtonAction() {
    if (!this.nativeService.isAndroid()) {
      return;
    }
    this.platform.registerBackButtonAction(() => {
      if (this.keyboard.isOpen()) { // 如果键盘开启则隐藏键盘
        this.keyboard.close();
        return;
      }
      const activeNav: any = this.app.getActiveNavs()[0]; // 当前活动页
      const overlay = this.app._appRoot._overlayPortal.getActive() || this.app._appRoot._modalPortal.getActive()
      // console.log(activeNav, 'activeNav')
      // console.log(overlay, 'overlay')
      // 先判断是否弹出层
      if (overlay) {
        overlay.dismiss()
        return
      }
      // 判断能否返回
      if (activeNav.canGoBack()) {
        activeNav.pop()
        return
      } else {
        // 退出
        this.showExit()
        return
      }
    }, 1);
  }

  // 退出
  showExit() {
    if (this.showToast) { // 第二次按返回，退出
      this.platform.exitApp()
    } else {
      // 第一次按弹框提示
      this.showToast = true
      this.toastCtrl.create({
        message: '再按一次退出应用',
        duration: 1500,
        position: 'bottom',
        cssClass: 'exit-toast'
      }).present().then(() => {
        setTimeout(() => { // 1.5s后超时，重置状态
          this.showToast = false
        }, 1500);
      })

    }
  }

  jushinit(){
    document.addEventListener('jpush.receiveNotification', (event: any) => {
        //修改角标数量
          cordova.plugins.notification.badge.increase(1);
          console.log(event,'Receive notification');
        //   alert('Receive notification: ' + JSON.stringify(event));
      }, false);
    /**打开消息触发 */
      document.addEventListener('jpush.openNotification', (event: any) => {
          console.log(event,'open notification');
          this.navCtrl.push('MsgPage');//点击消息跳转到消息列表页
      }, false);
  }
}

