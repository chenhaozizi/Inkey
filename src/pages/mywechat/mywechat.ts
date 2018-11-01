import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Item } from 'ionic-angular';
import { ImgService } from "../../app/app.img.service"
import { AppService } from './../../app/app.service';
/**
 * Generated class for the MywechatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mywechat',
  templateUrl: 'mywechat.html',
})
export class MywechatPage {
  isShow = false;
  token;
  twocode;
  // 图片上传的的api
  public uploadApi: '/Home/FileListUploadForApp';
  towcode;
  constructor(public navCtrl: NavController, public appService: AppService, public navParams: NavParams, public imgSer: ImgService, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MywechatPage');
    this.appService.getItem("user_token", res => {
      this.token = res
    })
    this.appService.httpGet('/Api/Home/GetWxQRCode', '', res => {
      if (res) {
        this.twocode = res.Item
        this.appService.getItem('userInfo',re=>{
          //写入本地储存
        re.WxQRCode=res.Item
        this.appService.setItem('userInfo',re)
      })
      }
    }, false, this.token)
  }
  getWechat() {
    this.isShow == false ? this.isShow = true : this.isShow = false;
  }
  showToast(message: string, position: string = "10px") {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: position
    });
    toast.present();

    return toast;
  }
  private initImgSer() {
    this.imgSer.upload.success = (data) => {
    let d = data[0].replace('middle/','')
    console.log(d)
      this.appService.httpGet('/Api/Home/BindingWxQRCode', { wxQRCode: d }, res => {
        console.log(res)
        if (res) {
          this.twocode = data[0].replace('middle/','');
          this.showToast('上传成功');
          this.appService.getItem('userInfo',res=>{
              //写入本地储存
            res.WxQRCode=data[0].replace('middle/','')
            this.appService.setItem('userInfo',res)
          })
        }
      }, false, this.token)
    };
    this.imgSer.upload.error = (err) => {
      this.showToast('上传失败');
    };
  }
  avatarChoice() {
    this.initImgSer();
    this.imgSer.showPicActionSheet(1, 'lib',8);
  }

}
