
import { ActionSheetController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AppShare } from '../../app/app.share';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { AppService, AppGlobal } from './../../app/app.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { CardSharePage } from "../../pages/card-share/card-share";
import { ImgService } from "../../app/app.img.service";
import html2canvas from 'html2canvas';//屏幕截图
import { PhotoLibrary } from '@ionic-native/photo-library';//保存本地api
import { JSONP_ERR_NO_CALLBACK } from '@angular/common/http/src/jsonp';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';
let self;



/**
 * Generated class for the CardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-card',
  templateUrl: 'card.html',
})

export class CardPage {
  userInfo;
  ip_src;
  qrcode;
  cardSharePage;
  twocode;
  canvasImg;
  par = {
    shareimg: '',
    Title: '分享名片',
    description: '分享名片'
  };
  ifshow = true;//制作海报按钮是否显示
  constructor(public photoLibrary: PhotoLibrary, public navCtrl: NavController, public navParams: NavParams, public appService: AppService, private sanitizer: DomSanitizer, public imgSer: ImgService, private toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController,
    public appShare: AppShare, public platform: Platform) {
    self = this;
    this.cardSharePage = 'CardSharePage'
    this.ip_src = AppGlobal.shopsrc;
    this.appService.getItem("userInfo", res => {
      this.userInfo = res
    })
  }
  ionViewWillEnter() {
    this.appService.getItem("userInfo", res => {
      this.userInfo = res
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CardPage');
    this.appService.httpGet('/Api/Home/ImgQRCode', { 'salesUserId': this.userInfo.Id }, res => {
      console.log(res)
      if (res.Item) {
        this.qrcode = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + res.Item);
      }
    }, false, '')
  }

  avatarChoice() {
    //选取图片
    var imgsrc;
    if (this.platform.is('cordova')) {
      console.log('在移动设备环境')
      this.imgSer.getPhoto(0, res => {
        imgsrc = res;
        console.log('选取的图片：', imgsrc)
        this.navCtrl.push(this.cardSharePage, { 'imgsrc': imgsrc })
      });
    } else {
      console.log('在网页环境下用模拟数据')
      imgsrc = "../../assets/imgs/1.png";
      this.navCtrl.push(this.cardSharePage, { 'imgsrc': imgsrc })
    }
  }

  savaImg() {
    let element: any = document.querySelector("#mainTable");
    console.log(element)
    //调用html2image方法
    html2canvas(element, {
      useCORS: true // 【重要】开启跨域配置
    }).then(canvas => {
      console.log(canvas)
      this.canvasImg = canvas.toDataURL("image/jpeg", '0.5')
      console.log('保存的地址：', this.canvasImg)
      self.par.shareimg =this.canvasImg  
    })
  }

  saveImgToLocal(imgUrl) {
    this.photoLibrary.requestAuthorization().then(() => {
      console.log('进入存图片')
      this.photoLibrary.saveImage(imgUrl, '盈客引擎').then((libraryItem) => {
        console.log('存图成功');
        this.appService.toast("存图成功");
        // alert(JSON.stringify(libraryItem));
        console.log(libraryItem.id);          // ID of the photo
        console.log(libraryItem.photoURL);    // Cross-platform access to photo
        console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
        console.log(libraryItem.fileName);
        console.log(libraryItem.width);
        console.log(libraryItem.height);
        console.log(libraryItem.creationDate);
        console.log(libraryItem.latitude);
        console.log(libraryItem.longitude);
        console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
      });
    }).catch(err => {
      console.log('存图失败');
      this.appService.toast("存图失败，请确认是否开启权限");
      console.log('permissions weren\'t granted')
      console.log(err);
    });
  }
  share() {
    this.ifshow = false;
    setTimeout(() => {
      self.savaImg();
      let actionSheet = this.actionSheetCtrl.create({
        title: '分享',
        buttons: [
          {
            text: '保存',
            handler: () => {
              console.log('保存到本地:')
              setTimeout(() => {
                console.log('将要保存的图地址：',this.canvasImg)
                this.saveImgToLocal(this.canvasImg);
                this.ifshow = true;
              }, 1000);
  
            }
          },
          {
            text: '微信好友',
            handler: () => {
              setTimeout(() => {
                console.log('将要分享的图地址：',this.par.shareimg  )
                this.appShare.wxShare(0, this.par, 1, 1)
              }, 1000);
              this.ifshow = true;
            }
          },
          {
            text: '朋友圈',
            handler: () => {
              setTimeout(() => {
                console.log('将要分享的图地址：',this.par.shareimg  )
                this.appShare.wxShare(1, this.par, 1, 1)
              }, 1000);
              this.ifshow = true;
            }
          },
          {
            text: '取消',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
              this.ifshow = true;
            }
          }
        ]
      });
      actionSheet.present();
    }, 500);
  
    
  }

}
