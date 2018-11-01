import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController ,LoadingController} from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import { AppService, AppGlobal } from './../../app/app.service';
import {MINI_SHAREPATH} from "../../providers/Constants";
import html2canvas from 'html2canvas';//屏幕截图
import { Http, Headers, RequestOptions  } from '@angular/http';
/**
 * Generated class for the ShareinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let self;
let loading
@IonicPage()
@Component({
    selector: 'page-shareinfo',
    templateUrl: 'shareinfo.html',
})
export class ShareinfoPage {
    ip_src = AppGlobal.imgsrc;
    defautimg=AppGlobal.defautsharimg
    public cont = {
        Id:'',
        IsLike:false,
        LikeCount:0,
        ImagesPic:[],
        Title:''
    };
    id;
    stateRecordPage;
    user_token;
    iszan=false;
    userInfo
    canvasImg;par
     
    ifshow=false;;wxcode;wxcodeUrl
    constructor(public navCtrl: NavController,
        public appService: AppService,
        public sanitizer: DomSanitizer,
        public modalCtrl: ModalController,
        public http :Http,
        public navParams: NavParams, public appShare: AppShare, public actionSheetCtrl: ActionSheetController,public loadingCtrl:LoadingController) {
        this.id = navParams.get("id");
        this.stateRecordPage='StateRecordPage';
        this.appService.getItem('user_token',res=>{
            this.user_token=res;
        })
        loading= this.loadingCtrl.create({
            content: '操作处理中,请耐心等待！'//数据加载中显示
        });
        this.initload();
     self=this
     this.wxcodeUrl =AppGlobal.WXcode
     console.log( this.wxcodeUrl)
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ShareinfoPage');

    }
    ionViewWillEnter() {
        this.appService.getItem("userInfo", res => {
          this.userInfo = res
         
        })
    }
    assembleHTML(strHTML: any) {
        return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }
    initload() {

        this.appService.httpGet('/Api/Article/GetArticleById', { id: this.navParams.get("id") }, d => {
            if (d) {
                d.Item.CreateTime = this.appService.getNowFormatDate(d.Item.CreateTime, false);
                console.log(d.Item.CreateTime)
                if(d.Item.CreateUserType){
                    d.Item.CreateUserType='店长'
                  }else{
                    d.Item.CreateUserType='导购'
                  }
                  this.iszan=d.Item.IsLike;
                this.cont = d.Item;
            } else {
                console.log("token无效")
            }

        }, true,this.user_token );

    }
    //分享
    share(event,id) {
        var path='?scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id
       
        this.par={
            'Logo':this.cont.ImagesPic[0] || this.defautimg,
            'Title':this.cont.Title,
            'ArticleId':this.cont.Id,
            'ShareLink':'www.baidu.com',
            'sharid':id,
            'Path':MINI_SHAREPATH.articleDetail+path
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
                       
                        // this.appService.shareWX(par)
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
        loading.present();
    this.appService.httpPost('/Api/ShareRecord/AddShareRecord',this.par,res=>{
            if(res.Item.IsValid){
                sharid=res.Item.EntityId;
                var path=''
                path+='?page='+MINI_SHAREPATH.articleDetail;
                path+='&scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id+MINI_SHAREPATH.linkstr+sharid+MINI_SHAREPATH.linkstr+this.cont.Id;
                path+='&width=170'+'&name='+new Date().getTime();
                console.log(path,this.wxcodeUrl+path)
                this.getWXcode(path)
            }
    })
       
      }

      getWXcode(pars){
        var headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        let options = new RequestOptions(JSON.stringify({ headers: headers }));
      this.http.request(this.wxcodeUrl+pars,options).subscribe((res) => {
          console.log(res.json().data)
          if(res.json().data){
              this.wxcode=res.json().data;
              //进入截图
              setTimeout(() => {
                  self.getcanvas()
              }, 1000);
              
          }
        });
    }
    getcanvas(){
        let element: any = document.querySelector("#mainTable");
              html2canvas(element, {
                useCORS: true // 【重要】开启跨域配置
              }).then(canvas => {
                
                console.log(canvas)
                this.canvasImg = canvas.toDataURL("image/jpeg",0.5)
                loading.dismiss()
                this.par.shareimg=this.canvasImg
                console.log('保存的地址：', this.canvasImg)
                this.ifshow=false
                  this.appShare.wxShare(1,this.par,1,1)
              })
    }
    //点赞
    like(){
        if(!this.cont.IsLike){
            console.log(this.cont.Id)
            this.appService.getItem('user_token',res=>{
                this.appService.httpGet("/Api/Article/LikeArticle",{'articleId':this.cont.Id},res=>{
                  this.cont.IsLike=true
                    this.cont.LikeCount=this.cont.LikeCount+1;
                },false,res)
            })
        }
        
       
    }

}
