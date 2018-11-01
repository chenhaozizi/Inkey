
import {Injectable} from '@angular/core';
import {Platform, AlertController} from 'ionic-angular';
import {AppVersion} from '@ionic-native/app-version';
import {File} from '@ionic-native/file';
import {Transfer, TransferObject} from '@ionic-native/transfer';
import {FileOpener} from '@ionic-native/file-opener';
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {APP_DOWNLOAD, APK_DOWNLOAD} from "./Constants";
import { AppService,AppGlobal } from '../app/app.service';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class NativeService {
    public headers;
    public loca_v;
    public serv_v;
    public hasnew;
    public permissions;
    public iosv;ioslink
  constructor(private platform: Platform,
              private alertCtrl: AlertController,
              private transfer: Transfer,
              private appVersion: AppVersion,
              private file: File,
              private fileOpener: FileOpener,
              private inAppBrowser: InAppBrowser,
              private http:AppService,
              private androidPermissions:AndroidPermissions,
              public https:Http
            ) {
              console.log()
              }


  /**
   * 检查app是否需要升级
   */
  // 检查应用的读取权限
  checkpermiss(){
    if (this.platform.is('cordova')) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result =>  {
        if(result.hasPermission){//
          console.log("有读取权限,进入判断是否有更新")
          this.detectionUpgrade();
        }else{
          console.log("无读取权限,开始授权")
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(res=>{
            if(res.hasPermission){
              console.log('开启权限成功，进入判断是否有更新')
              this.detectionUpgrade()
            }else{
              console.log("权限开启失败，请手动开启")
            }
          })
        }
        console.log('Has permission?',result.hasPermission); 
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(res=>{
        console.log(res)
        
      })
    );
    }else{
      console.log("不是真机运行!")
      this.getIosversion()
    }
 }
 getIosversion(){
    //获取ios的appstore版本
    console.log(AppGlobal.iosAppId)
    this.https.get('http://itunes.apple.com/lookup?id='+AppGlobal.iosAppId )
    .toPromise()
    .then(res => {
      console.log(res)
     let data=JSON.parse(res['_body']).results[0];
        console.log('获取的ios的版本',data)
        if(data){
           this.ioslink=data.trackViewUrl
           this.serv_v= data.version+0;
           console.log(this.serv_v)
           this.getVersionNumber();
        }
    })
 }
 detectionUpgrade() {
    console.log("升级检查")
    if (this.platform.is('cordova')) {
    console.log("cordova可用")
    console.log("是否是真机："+this.platform.is('mobile') && !this.platform.is('mobileweb'))
      this.http.httpGet('/Api/User/GetAppVersion', '', d => {
        this.serv_v=d.Item.Version;
        this.http.setItem("ip_version",d.Item.Version)
        console.log("服务器版本号：",this.serv_v,typeof(this.serv_v));
       // this.versionfunegt(this.serv_v,"0.0.2")
       if(this.isIos()){
        this.getIosversion()
       }else{
        this.getVersionNumber();
       }
        
        
      }, true, "");
    }else{
      console.log("cordova不可用")
    }
    //这里连接后台获取app最新版本号,然后与当前app版本号(this.getVersionNumber())对比
    //版本号不一样就需要升级,不需要升级就return
  }
  //弹出更新框
  show(){
      this.alertCtrl.create({
          title: '升级',
          subTitle: '发现新版本,是否立即升级？',
          buttons: [{text: '取消'},
            {
              text: '确定',
              handler: () => {
                console.log("用户点击了确定")
                this.downloadApp();
              }
            }
          ]
        }).present();
  }
  /**
   * 下载安装app
   */
  downloadApp() {
    console.log("开始下载")
    if (this.isAndroid()) {
      let alert = this.alertCtrl.create({
        title: '下载进度：0%',
        enableBackdropDismiss: false,
        buttons: ['稍后下载']
      });
      alert.present();

      const fileTransfer: TransferObject = this.transfer.create();
      const apk = this.file.externalRootDirectory +'/inkey.apk'; //apk保存的目录 this.file.externalRootDirectory + 
      console.log("apk保存的目录:",apk)
      fileTransfer.download(APK_DOWNLOAD, apk).then((res) => {
        console.log(res) ; console.log("下载成功")
       this.fileOpener.open(apk,'application/vnd.android.package-archive').then(function () {
        // 成功
        console.log("打开APK成功")
        }, function (err) {
          console.log(err);
        });
      }).catch(err=>{
        console.log("打开apk失败"+err)
      });

      fileTransfer.onProgress((event: ProgressEvent) => {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
          alert.dismiss();
        } else {
          let title = document.getElementsByClassName('alert-title')[0];
          console.log("title:"+title)
          title && (title.innerHTML = '下载进度：' + num + '%');
        }
      });
    }
    if (this.isIos()) {
      window.open(this.ioslink); // or itms://
      
     // this.openUrlByBrowser(APP_DOWNLOAD);
    }
  }

  /**
   * 通过浏览器打开url
   */
  openUrlByBrowser(url:string):void {
    this.inAppBrowser.create(url, '_system');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile(): boolean {
    
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos(): boolean {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  /**
   * 获得app版本号,如0.01
   * @description  对应/config.xml中version的值
   * @returns {Promise<string>}
   */
   // 比较版本号
   versionfunegt (a, b) {
    var _a = this.toNum(a), _b = this.toNum(b);   
    if(_a == _b) {
        console.log("版本号相同！版本号为："+a);
        return false;
    } else if(_a > _b) {
        console.log("版本号a"+a+"是新版本！"); 
        this.show();
        
    } else {
        console.log("版本号b"+b+"是新版本！"); 
        return false;
    }
}

toNum (a) {
  console.log(a,typeof(a))
    var a = a.toString();
    //也可以这样写 var c=a.split(/\./);
    var c = a.split('.');
    var num_place = ["","0","00","000","0000"], r = num_place.reverse();
    for (var i = 0; i< c.length; i++){ 
        var len = c[i].length;       
        c[i] = r[len] + c[i];  
    } 
    var res = c.join(''); 
    console.log(res)
    return res; 
} 
//获取版本号
  getVersionNumber()  {
    console.log('检测版本号')
    this.appVersion.getVersionNumber().then((value: string) => {
      console.log("本机版本号：",value);
      this.http.setItem("loc_version",value);
      console.log(typeof(value))
      this.toNum(value);
     this.versionfunegt(this.serv_v,value);
    }).catch(err => {
      console.log('getVersionNumber:' + err);
    });
  }
  //
}

