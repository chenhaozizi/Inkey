import { LoadingController, Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AppService,AppGlobal } from '../app/app.service';
import {MINI_SHAREPATH} from "../providers/Constants";
declare let Wechat;
declare var QQSDK;
declare var window;
let appid='gh_fed93c5cc0d0'
let sharid;
@Injectable()
export class AppShare {
    sharpar;
    loading = this.loadingCtrl.create({ showBackdrop: false });
    //标题
    title: string = "盈客引擎"
    //描述
    description: string = "盈客引擎";
    //分享链接
    link: string = AppGlobal.defautsharimg;
    //分享图片
    image: string = AppGlobal.defautsharimg;

    constructor(public loadingCtrl: LoadingController, platform: Platform,public appService:AppService) {
        // if (platform.is('ios')) {
        //     this.link = "https://itunes.apple.com/cn/app/女装尖货-单件月销1-8万/id1194942857?mt=8";
        // }
        // else if (platform.is('android')) {
        //     this.link = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.tongedev.dress";
        // } else {
        //     this.link = "http://dress.tongedev.cn";
        // }
        
        // console.log(Wechat)
        console.log(window.Wechat,window)
    }

    wxShare(scene,par,sharetype?,noadd?,isshop?) {//sharetype 1:图片 0：分享小程序 isshop:1 活动分享  2：商品分享,3:优惠券分享，4：盈客圈分享
        console.log("进入分享",par)
         var pars :any={
            Logo:par.Logo,
            Title:par.Title,
            ShareLink:par.ShareLink,
            GoodsId:par.GoodsId,
            ActivityId:par.ActivityId,
            ArticleId:par.ArticleId,
            CouponId:par.CouponId
         }
        this.loading.present();
        if(!noadd){
            this.appService.getItem('user_token',res=>{
                this.appService.httpPost('/Api/ShareRecord/AddShareRecord',pars,res=>{
                    if(res.Item.IsValid){
                        sharid = res.Item.EntityId
                        console.log(sharid)
                        this.WechatWx(scene,par,sharetype,noadd,isshop)
                    }else{
                        console.log(res.Item.ErrorMessages)
                        this.appService.alert(res.Item.ErrorMessages)
                       
                    }
                },false,res)
            })
        }else{
            this.WechatWx(scene,par,sharetype,noadd,isshop)
        }
        //this.appService.shareWX(par);
       
    }
    WechatWx(scene,par,sharetype,noadd,isshop){
        try {
            if(sharetype){
             console.log('图片分享')
                //图片分享
                this.sharpar={
                    title:par.Title || this.title,
                    description: par.description || this.description,
                    thumb: par.shareimg || this.image,
                    media: {
                    type:Wechat.Type.IMAGE,
                    image: par.shareimg || this.image
                    }
                }
             
            }else{
                console.log('非图片分享')
                //非图片分享
                var shtype,baseurl,sharepath;
               if(scene){
                 
                 shtype=Wechat.Type.WEBPAGE,
                 baseurl='www.baidu.com',
                 sharepath=par.ShareLink
                 console.log('朋友圈分享',sharepath)
               }else{
                   if(!noadd ){
                       if(isshop ==2){
                        sharepath=par.Path+MINI_SHAREPATH.linkstr+sharid+MINI_SHAREPATH.linkstr+par.sharid+MINI_SHAREPATH.linkstr
                       }else{
                        sharepath=par.Path+MINI_SHAREPATH.linkstr+sharid+MINI_SHAREPATH.linkstr+par.sharid
                       }
                   }else{
                    if(isshop ==2){
                        sharepath=par.Path+MINI_SHAREPATH.linkstr+par.sharid+MINI_SHAREPATH.linkstr
                       }else{
                        sharepath=par.Path+MINI_SHAREPATH.linkstr+MINI_SHAREPATH.linkstr+par.sharid
                       }
                   
                   }
                
                 console.log('会话分享',sharepath)
                 baseurl='pages/index'
                 shtype=Wechat.Type.PROGRAMOBJECT
                 
               }
               this.sharpar={
                 title:par.Title || this.title,
                 description: par.description || this.description,
                 thumb: par.Logo || this.image,
                 media: {
                     webpageUrl:baseurl,
                     type:shtype,//小程序或者链接
                     username:appid,
                     path:sharepath,
                     miniprogramtype:0//0：正式版，2：体验版
                 }
               }
            }
            console.log('分享小程序参数：',this.sharpar)
            Wechat.share({
             message:this.sharpar,
             scene: scene == 0 ? Wechat.Scene.SESSION : Wechat.Scene.Timeline
         }, function () {
             console.log('分享成功')
         }, function (reason) {
             console.log('分享失败',reason)
         });
         } catch (error) {
             console.log(error);
         } finally {
             this.loading.dismiss();
         }
    }
}
