import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { AppService } from "../../app/app.service";
import { ImgService } from "../../app/app.img.service"

/**
 * Generated class for the ChangeUserNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-user-name',
  templateUrl: 'change-user-name.html',
})
export class ChangeUserNamePage {
  id;
  user_token;
  name;
  newName;
  twocode = '';
  constructor(public navCtrl: NavController,private toastCtrl: ToastController, public imgSer: ImgService,public navParams: NavParams, private appService: AppService) {

    this.id = this.navParams.get('id');
    this.name = this.navParams.get('name');

    console.log(this.id, this.name)
    this.appService.getItem('user_token', res => {
      this.user_token = res
     
    })
    this.appService.getItem('userInfo', res => {
     
      this.twocode = res.Logo
      console.log(this.twocode)
    })

  }
  changeName() {
    if(this.newName){
      this.newName=this.newName.replace(/(^[\s\n\t]+|[\s\n\t]+$)/g, "")
    }
    
    console.log(this.newName)
    if(!this.newName || this.newName ==''){
      this.newName=this.name
    }
    let para = { 'Name': this.newName,Logo:this.twocode }
    this.appService.httpPost('/Api/User/ModifyName', para, res => {
      this.appService.getItem("userInfo", res => {
        res.Name = this.newName;
        res.Logo=this.twocode
        this.appService.setItem("userInfo", res)
      })
      console.log(res);
      this.navCtrl.pop();
    }, false, this.user_token)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeUserNamePage');
  }
  private initImgSer() {
    this.imgSer.upload.success = (data) => {
          this.twocode = data[0].replace('middle/','');
          console.log(this.twocode)
          this.showToast('上传成功');
    };
    this.imgSer.upload.error = (err) => {
      this.showToast('上传失败');
    };
  }
  avatarChoice() {
    this.initImgSer();
    this.imgSer.showPicActionSheet(1, 'lib',8);
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
}
