import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController,LoadingController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AppShare } from '../../app/app.share';
import { AppService,AppGlobal } from '../../app/app.service';
import html2canvas from 'html2canvas';//屏幕截图
import {MINI_SHAREPATH} from "../../providers/Constants";
import { Http, Headers, RequestOptions  } from '@angular/http';
/**
 * Generated class for the ActiveInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let self,loading;
@IonicPage()
@Component({
  selector: 'page-active-info',
  templateUrl: 'active-info.html',
})
export class ActiveInfoPage {
    activity={
        Banner:'',Title:'',Id:'',Description:''
    };
    ip_src;wxcode;
    canvasImg
    par;userInfo;wxcodeUrl;
    ifshow=false;
  constructor(public navCtrl: NavController, public sanitizer: DomSanitizer,public http:Http,public loadingCtrl:LoadingController,  public navParams: NavParams,public appShare:AppShare,public actionSheetCtrl: ActionSheetController,public appService:AppService) {
    this.appService.getItem('userInfo',res=>{
        this.userInfo=res
    })
    self=this
    this.ip_src = AppGlobal.shopsrc;
    this.wxcodeUrl =AppGlobal.WXcode
    this.navParams.get('Id');
    loading= this.loadingCtrl.create({
        content: '操作处理中,请耐心等待！'//数据加载中显示
    });

    this.appService.httpGet('/Api/Activity/GetActivityById',{'Id':this.navParams.get('Id')},res=>{
        console.log(res);
        //res.Item.ActivityRule= this.
        res.Item.StartTime = this.appService.getNowFormatDate(res.Item.StartTime,false);
        res.Item.EndTime = this.appService.getNowFormatDate(res.Item.EndTime,false)
        this.activity=res.Item;
    },true,'')

}
assembleHTML(strHTML: any) {
    return this.sanitizer.bypassSecurityTrustHtml(strHTML);
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad ActiveInfoPage');

  }
  share(event) {
   
    var path='?scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id
      this.par={
        'Logo':this.ip_src+this.activity.Banner,
        'Title':this.activity.Title,
        'shareimg':'',
        'ShareLink':'www.baidu.com',
        'ActivityId':this.activity.Id,
        'sharid':this.activity.Id,
        'description':this.activity.Description,
        'Path':MINI_SHAREPATH.activityDetail+path

    }
    let actionSheet = this.actionSheetCtrl.create({
    title: '分享',
    buttons: [
        {
        text: '微信好友',
        handler: () => {
            this.appShare.wxShare(0,this.par)
        }
        },
        {
        text: '朋友圈',
        handler: () => {
            this.ifshow=true
            self.savaImg()
         
          
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
savaImg() {
    var sharid;
    loading.present()
    this.appService.httpPost('/Api/ShareRecord/AddShareRecord',this.par,res=>{
            if(res.Item.IsValid){
                sharid=res.Item.EntityId;
                var path=''
                path+='?page='+MINI_SHAREPATH.activityDetail;
                path+='&scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id+MINI_SHAREPATH.linkstr+sharid+MINI_SHAREPATH.linkstr+this.activity.Id;
                path+='&width=100'+'&name='+new Date().getTime();
                console.log(path,this.wxcodeUrl+path)
                this.getWXcode(path)
            }
    })
  }
  getWXcode(pars){
      var headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      let options = new RequestOptions(JSON.stringify({ headers: headers }));
    this.http.request(this.wxcodeUrl+ pars,options).subscribe((res) => {
        console.log(res.json().data)
        if(res.json().data){
            this.wxcode=res.json().data;
            
            //进入截图
            setTimeout(function(){self.getcavas()},1000)
        }
      });
  }
  getcavas(){
    let dom: any = document.querySelector("#cavas");
    html2canvas(dom, {
    useCORS: true // 【重要】开启跨域配置
    }).then(canvas => {
    console.log(canvas)
    this.canvasImg = canvas.toDataURL("image/jpeg",0.5);
    loading.dismiss()
     this.ifshow=false
    this.par.shareimg=this.canvasImg
    console.log('保存的地址：', this.canvasImg)
    
    this.appShare.wxShare(1,this.par,1,1)
    })
  }
}
