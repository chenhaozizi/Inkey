
import { AppService, AppGlobal } from './../../app/app.service';
import { AppShare } from '../../app/app.share';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import html2canvas from 'html2canvas';//屏幕截图
import { PhotoLibrary } from '@ionic-native/photo-library';//保存本地api
let self;



@IonicPage()
@Component({
  selector: 'page-card-share',
  templateUrl: 'card-share.html',
})
export class CardSharePage {
  canvasImg = '';
  imgSrc = '';
  userInfo;
  ip_src;
  par;
  constructor(public appShare: AppShare, public navCtrl: NavController, public navParams: NavParams, public photoLibrary: PhotoLibrary, public appService: AppService, public actionSheetCtrl: ActionSheetController) {
    self=this;
    this.imgSrc = 'data:image/png;base64,' + this.navParams.get('imgsrc');
    this.appService.getItem('userInfo', res => {
      this.userInfo = res
    })
    this.ip_src = AppGlobal.imgsrc;
    console.log('传入得图片地址imgSrc：', this.imgSrc)

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CardSharePage');
  }
  savaImg() {
    let ele: any = document.querySelector("#imgTable");
    console.log(ele)
    //调用html2image方法
    html2canvas(ele, {
      useCORS: true // 【重要】开启跨域配置
    }).then(canvas => {
      console.log(canvas)
      this.canvasImg = canvas.toDataURL("image/jpeg",'0.5')
      console.log('保存的地址：', this.canvasImg)
      self.par.shareimg=this.canvasImg
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
    self.savaImg();
    this.par = {
      shareimg: this.canvasImg,
      Title: '分享名片',
      description: '分享名片'
    }
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

          }
        },
        {
          text: '朋友圈',
          handler: () => {
            setTimeout(() => {
              console.log('将要分享的图地址：',this.par.shareimg  )
              this.appShare.wxShare(1, this.par, 1, 1)             
            }, 1000);

          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  


}
