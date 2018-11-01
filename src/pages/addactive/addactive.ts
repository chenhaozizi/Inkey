import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { ImgService } from "../../app/app.img.service"
import { AppService } from "../../app/app.service";
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Generated class for the AddactivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let op;
@IonicPage()
@Component({
  selector: 'page-addactive',
  templateUrl: 'addactive.html',
})
export class AddactivePage {
  startTime: any = "请选择";
  endTime: any = "请选择";
  rtitle = ''; raddress = ''; rcont = '';
  // 图片上传的的api
  public uploadApi: '/Home/FileListUploadForApp';
  img;
  r_img;
  piclists = [];
  r_piclists = [];
  upload_piclists = [];//处理为大图后的，将要提交的盈客圈活动的图片
  type;
  title;
  cont;
  token;
  imgpic=[];
  constructor(
    public navCtrl: NavController,
    public appService: AppService,
    public navParams: NavParams,
    public imgSer: ImgService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private sanitizer: DomSanitizer) {
    this.endTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();//获取时间戳
    this.startTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString();//获取时间戳
    //new Date(this.endTime).getTime() 
  }
  ionViewDidLoad() {
    this.type = this.navParams.get('type');//type:1 添加活动   type:0 添加盈客群
    if (this.type) {
      this.title = '活动';
      this.cont = '请填写活动规则'
    } else {
      this.title = '盈客圈';
      this.cont = '描述一下盈客圈的细节和故事'
    }
    console.log(this.type)
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
  //创建活动的主题海报
  private initImgSer() {
    this.imgSer.upload.success = (data) => {
      console.log('盈客圈界面上传成功后返回的网络图数据：', data)
      if (data !== '') {
        this.img = data[0];
        console.log('已传海报', this.img)
      }
    };
    this.imgSer.upload.error = (err) => {
      this.showToast('上传失败');
    };
  }
  //创建活动的主题海报
  avatarChoice(type) {
    this.initImgSer();
    this.imgSer.showPicActionSheet(type, 1, 8);
  }
  //多张图
  piclistinit() {
    // console.log('已选图片的数量', this.imgSer.upload.localpath )
    //  this.imgSer.upload.localpath=(data)=>{
    //    console.log('返回的localpath:',data)
    //    for(var i in data){
    //      data[i]=this.sanitizer.bypassSecurityTrustUrl(data[i])
    //    }
    //     this.piclists.push(...data);
    //     console.log('新的图片集合：',this.piclists)

    //   // this.imgSer.upload.listen=(res)=>{
    //   //   console.log(res)
    //   // }
    //  }

    this.imgSer.upload.imagePicNum = (imgNum) => {
      //判断上传图的张数
      console.log('返回的张数', imgNum)
      for (let i = 0; i < imgNum; i++) {
        this.piclists.push('wait')
      }
    }
    this.imgSer.upload.success = (data) => {
      console.log('盈客圈界面上传成功后返回的网络图数据：', data)
      if (data !== '') {
        this.piclists = this.delwait(this.piclists, 'wait');
        data.forEach(dat => {
          if (dat == '' || dat == undefined || dat == null) {
            dat = '../../assets/icon/errorImg.jpg'
          }
          if (this.piclists.length < 9) {
            this.piclists.push(dat)
          }
        });
        console.log('已选图片', this.piclists)
      }
    };
    this.imgSer.upload.error = (err) => {
      this.showToast('上传失败');
    };
  }
  piclist(type) {
    console.log(1111)
    this.piclistinit();
    this.imgSer.showPicActionSheet(type, '', this.piclists.length);
  }

  delwait(arr, item) {
    let result = [];
    arr.forEach(function (element) {
      if (element != item) {
        result.push(element);
      }
    });
    return result;
  }

  addUploadImgsList() {
    console.log('开始进入处理为大图', this.piclists)
    let arrList = [];
    arrList = this.piclists.slice(0, 9);
    console.log('将要处理的数组', arrList)
    for (let i = 0; i < arrList.length; i++) {
      if (arrList[i].indexOf(/middle/) !== -1) {
        console.log('当前需要处理的图片', arrList[i])
        arrList[i] = arrList[i].replace(/middle/, 'big')
        console.log('处理后的图片', arrList[i])
      }
    }
    this.upload_piclists = arrList;
    console.log('处理结束', this.upload_piclists)
    console.log('开始进入处理为原图')
    for (let i = 0; i < this.upload_piclists.length; i++) {
        console.log('当前需要处理的图片', this.upload_piclists[i])
        this.imgpic[i] = this.upload_piclists[i].replace('/big', '')
        console.log('处理后的图片', this.imgpic[i])
      
    }
    console.log('上传的imgpic',this.imgpic)
  }

  confirm() {
    var storid;
    this.appService.getItem('user_token', res => {
      this.token = res
    })
    this.appService.getItem('userInfo', res => {
      storid = res.CompanyId
    })
    if (this.rtitle.length < 1 || this.rcont.length < 1) {
      this.showToast('标题或内容不能为空！');
      return;
    }
    this.addUploadImgsList();
    
    var par, url, des = '';
    des += '<br />' + this.rcont + '<br />';
    for (let i = 0; i < this.upload_piclists.length; i++) {
      des += '<img src="' + this.upload_piclists[i] + '">'
    }

    if (this.type) {
      console.log(this.r_img)
      if (!this.r_img) {
        this.showToast('主题海报不能为空');
        return;
      }
      console.log(des)
      par = {
        'StoreId': storid,
        'Title': this.rtitle,
        'Banner': this.r_img,
        'ActivityRule': this.rcont,
        'Address': this.raddress,
        'StartTime': new Date(this.startTime).getTime(),
        'EndTime': new Date(this.endTime).getTime(),
        'Description': des
      }
      url = '/Api/Activity/Add'
    } else {
      par = {
        'Title': this.rtitle,
        'Content': des,
        'ImagesPic':  this.imgpic  || []
      }
      url = '/Api/Article/Add';
    }

    var confirm = this.alertCtrl.create({
      title: '提示',
      message: '此内容即将发布到平台，其他人都可看，确认发布吗？',
      buttons: [

        {
          text: '再想想',
          handler: () => {

          }
        },
        {
          text: '确认',
          handler: () => {
            this.appService.httpPost(url, par, res => {
              console.log(res)
              if (typeof (res) == 'string' && res.length != 2) {
                this.toastCtrl.create({
                  message: res,
                  duration: 1500
                }).present();
              } else {
                let toast = this.toastCtrl.create({
                  message: '发布成功',
                  duration: 1500
                });
                toast.present();
                setTimeout(() => {
                  this.navCtrl.pop();
                }, 2000);
              }


            }, false, this.token)

            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
    console.log(this.raddress, this.rtitle, this.startTime, this.r_img, this.upload_piclists)
  }
  //删除预览
  delimg(index) {
    this.piclists.splice(index, 1);
    console.log(this.piclists)

  }


}
