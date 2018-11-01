import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController,ModalController,LoadingController } from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import {ShoplistPage} from "../shoplist/shoplist";//商品列表
import { AppService ,AppGlobal} from './../../app/app.service';
import html2canvas from 'html2canvas';//屏幕截图
import {MINI_SHAREPATH} from "../../providers/Constants";
import { Http, Headers, RequestOptions  } from '@angular/http';
/**
 * Generated class for the ShopdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let self, loading;
@IonicPage()
@Component({
    selector: 'page-shopdetail',
    templateUrl: 'shopdetail.html',
})
export class ShopdetailPage {
    shoppage;
    companyId;
    shopDetail={
       Image:'',
       Name:''
    };
    userInfo;par;path;wxcodeUrl;wxcode;canvasImg;
    ifshow=false;

    constructor(public navCtrl: NavController,public http:Http,public loadingCtrl:LoadingController, public navParams: NavParams,public appShare: AppShare, public actionSheetCtrl: ActionSheetController,public appService:AppService,public modalCtrl:ModalController) {
        this.shoppage = ShoplistPage;
        self=this
        loading= this.loadingCtrl.create({
            content: '操作处理中,请耐心等待！'//数据加载中显示
        });
        this.wxcodeUrl =AppGlobal.WXcode
        this.appService.getItem("userInfo",res=>{
            this.userInfo=res
            this.companyId=res.CompanyId;
            this.path='?scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id
            this.appService.httpGet("/Api/Store/GetStoreById",{id:this.companyId},res=>{
                if(res.Item){
                  res.Item.Image=AppGlobal.imgsrc+res.Item.Image
                  this.shopDetail=res.Item;
                  console.log(this.shopDetail)
                }else{
                    console.log("token无效")
                };
            },false,'')
        })
        console.log(this.companyId)
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ShopdetailPage');
    }
    share(event) {
        
         this.par={
        'Logo':this.shopDetail.Image,
        'Title':this.shopDetail.Name,
        'sharid':'',
        'Path':MINI_SHAREPATH.home+this.path
    }
        let actionSheet = this.actionSheetCtrl.create({
            title: '分享',
            buttons: [
                {
                    text: '微信好友',
                    handler: () => {
                        this.appShare.wxShare(0,this.par,0,1)
                    }
                },
                {
                    text: '朋友圈',
                    handler: () => {
                        this.ifshow=true
                        this.savaImg()
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
        let path = this.path
        path+=MINI_SHAREPATH.linkstr+''+MINI_SHAREPATH.linkstr+'';
        path+='&width=100'+'&name='+new Date().getTime();
        console.log(path)
        this.getWXcode(path)
       
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
