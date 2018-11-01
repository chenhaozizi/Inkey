import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ActionSheetController,LoadingController} from 'ionic-angular';
import { AppShare } from '../../app/app.share';
import {MINI_SHAREPATH} from "../../providers/Constants";
import html2canvas from 'html2canvas';//屏幕截图
import { AppService, AppGlobal } from './../../app/app.service';
import { Http, Headers, RequestOptions  } from '@angular/http';
/**
 * Generated class for the GoodsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let self,loading;
@IonicPage()
@Component({
  selector: 'page-goods-detail',
  templateUrl: 'goods-detail.html',
})

export class GoodsDetailPage {
  detail={
    'GoodName':'',
    'SpecDes':'',
    "Price":'',
    "GoodsImg":'',
    "SalesCount":'',
    "SotreName":'',
    "StoreAddress":'',
    "GoodsId":''
    
  };userInfo;ip_src;id;canvasImg;ifshow=false;par;wxcode;wxcodeUrl;isCollage=''//是否是拼团商品
  constructor(public navCtrl: NavController,public appService:AppService,public http:Http,public loadingCtrl:LoadingController, public navParams: NavParams,public appShare: AppShare, public actionSheetCtrl: ActionSheetController) {
    this.ip_src = AppGlobal.shopsrc;
    this.id=this.navParams.get('Id');
    this.isCollage =this.navParams.get('isCollage')
    console.log(this.isCollage)
    console.log('dadada')
    this.appService.getItem("userInfo", res => {
      this.userInfo = res
    })
    self=this;
    this.wxcodeUrl =AppGlobal.WXcode
    loading= this.loadingCtrl.create({
      content: '操作处理中,请耐心等待！'//数据加载中显示
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoodsDetailPage');
    this.appService.httpGet('/Api/Good/GetGoodsByIdAndStore',{goodsId:this.id,storeId:this.userInfo.CompanyId},res=>{
      this.detail=res.Item;
  })
  }
  ionViewWillEnter() {
   
  }
  share(event,index,id) {
    console.log(index)  //type:0商品  1为活动  2优惠券
    
   let path='?scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id
    
      this.par={
        'Logo':this.ip_src+this.detail.GoodsImg,
        'Title':this.detail.GoodName,
        'ShareLink':'www.baidu.com',
        'description':this.detail.SpecDes,
        'GoodsId':this.detail.GoodsId,
        'sharid':this.detail.GoodsId,
        'Path':MINI_SHAREPATH.productDetail+path
    }
  

   
    let actionSheet = this.actionSheetCtrl.create({
      title: '分享',
      buttons: [
        {
          text: '微信好友',
          handler: () => {
          this.appShare.wxShare(0,this.par,0,0,2)
          }
        },
        {
          text: '朋友圈',
          handler: () => {
            this.ifshow=true
            self.savaImg()
             // this.appShare.wxShare(1,par,0,0)
          }
        },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            // actionSheet.dismiss();
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
                path+='?page='+MINI_SHAREPATH.productDetail;
                path+='&scene='+this.userInfo.CompanyId+MINI_SHAREPATH.linkstr+'1'+MINI_SHAREPATH.linkstr+this.userInfo.Id+MINI_SHAREPATH.linkstr+sharid+MINI_SHAREPATH.linkstr+this.detail.GoodsId+MINI_SHAREPATH.linkstr;
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
      let ele: any = document.querySelector("#cavs");
      html2canvas(ele, {
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
