import { Injectable } from "@angular/core";
import { ActionSheetController, ToastController, AlertController, LoadingController, Platform, ItemGroup } from "ionic-angular";
import { ActionSheet, ActionSheetOptions } from '@ionic-native/action-sheet';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { AppService } from "../app/app.service";
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer } from '@angular/platform-browser';
let self;

@Injectable()

export class ImgService {
    data;
    interval;
    // 调用相机时传入的参数
    private cameraOpt = {
        quality: 50,
        destinationType: 1,// 返回的图像的格式 0：base64  1：图像文件的url
        sourceType: 1, // 设置图像的来源 0：相册 1：相机,
        encodingType: 0, // Camera.EncodingType.JPEG  编码类型,
        mediaType: 0, // Camera.MediaType.PICTURE 媒体类型 0：图片 1：视频  2:所有格式,
        allowEdit: false,//是否允许编辑
        correctOrientation: true

    };
    
    //只能获取一张图片
    private photoOpt = {
        quality: 50,
        destinationType: 1,// 返回的图像的格式 0：base64  1：图像文件的url
        sourceType: 0, // 设置图像的来源 0：相册 1：相机,
        encodingType: 0, // Camera.EncodingType.JPEG  编码类型,
        mediaType: 0, // Camera.MediaType.PICTURE 媒体类型 0：图片 1：视频  2:所有格式,
        allowEdit: false,//是否允许编辑
        correctOrientation: true
    };

    // 图片上传的的api
    public uploadApi: 'http://139.159.146.138:8011/upload/uploadhandler.ashx';

    upload: any = {
        fileKey: 'upload',//接收图片时的key
        fileName: 'imageName.jpg',
        mimeType: 'image/png',
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',//不加入 发生错误！！
            'Content-Type': 'multipart/form-data'
        },
        params: {}, //需要额外上传的参数
        success: (data) => { },//图片上传成功后的回调
        localpath: (data) => { },
        imagePicNum:(data) =>{},//相册选取的数量
        error: (err) => { },//图片上传失败后的回调
        listen: (data) => { },//监听上传过程
        imgsrc:(data)=>{}//拍照得到的img元素
    };
    uploadSuccessReturn = [];//上传图片组成功以后返回的网络图地址组
    uploadImgProgress = [];//上传图片的进度
    imgList=[];//储存需要上传的本地图

    constructor(private actionSheetCtrl: ActionSheetController,
        private camera: Camera,
        private transfer: Transfer,
        private sanitizer: DomSanitizer,
        private toastCtrl: ToastController,
        private fileTransfer: TransferObject,
        private appService: AppService,
        private ActionSheet: ActionSheet,
        private alertCtrl: AlertController,
        private myfileTransfer: FileTransfer,
        public loadingCtrl: LoadingController,
        public imagePicker: ImagePicker,
        public platform: Platform,
        public base64: Base64
    ) {
        this.fileTransfer = this.transfer.create();
        self = this;

    }

    showPicActionSheet(type, lib, n?) {
        if (type) {
            this.useASComponent(lib, n);
        } else {
            this.useNativeAS()
        }
    }

    // 使用原生的ActionSheet组件
    private useNativeAS() {
        console.log('我是原生的ActionSheet组件')
        let buttonLabels = ['拍照', '从手机相册选择'];
        this.ActionSheet.show({
            'title': '选择',
            'buttonLabels': buttonLabels,
            'addCancelButtonWithLabel': 'Cancel',
            //'addDestructiveButtonWithLabel' : 'Delete'
        }).then((buttonIndex: number) => {
            if (buttonIndex == 1) {
                this.startCamera();
            } else if (buttonIndex == 2) {
                this.getPhoto();
            }
        });
    }
    // 使用ionic中的ActionSheet组件
    private useASComponent(lib, n?) {
        // n 代表已选图的数量  lib控制拍照
        console.log('我是ionic中的ActionSheet组件')
        var butt;
        if (lib) {
            butt = [{
                text: '从手机相册选择',
                handler: () => {
                    // this.getPhoto()
                    this.openImgPicker(n)
                }
            },
            {
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }]
        } else {
            butt = [
                {
                    text: '拍照',
                    handler: () => {
                        this.startCamera();

                    }
                },
                {
                    text: '从手机相册选择',
                    handler: () => {
                        // this.getPhoto()
                        this.openImgPicker(n)
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {

                    }
                }
            ]
        }
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择',
            buttons: butt
        });
        actionSheet.present();
    }

    // 启动拍照功能
    private startCamera() {
        console.log('开启拍照功能')
        this.uploadSuccessReturn = [];
        this.upload.imagePicNum(1);
        this.camera.getPicture(this.cameraOpt).then((imageData) => {
            console.log("相机获取的图片");
            let imgUrl = "<img src=" +imageData +" width=\"60px\" height=\"60px\">  ";
            this.upload.imgsrc(imgUrl)
            this.base64.encodeFile(imageData).then((base64File: string) => {
                base64File = base64File.replace('data:image/*;charset=utf-8;base64', 'data:image/jpg;base64')
                let basepath = [];
                basepath[0] = base64File;
                this.upload.localpath(basepath)
            }, (err) => {
                console.log(err);
            })
            this.uploadImg(imageData, 1, 0);
        }, (err) => {
            this.showToast('ERROR:' + err);//错误：无法使用拍照功能！
        });
    }

    // 打开手机相册
    public getPhoto(n?, callback?) {
        if (callback) {
            this.photoOpt.destinationType = 0;
        }
        this.camera.getPicture(this.photoOpt).then((imageData) => {
            console.log("相机选择的图片", imageData);
            if (n) {
                console.log('上传选取的图')
                this.uploadImg(imageData);
            } else {

                if (callback) {
                    console.log('不上传，直接返回选取的图')
                    callback(imageData)
                } else {
                    this.uploadImg(imageData);
                }
            }

        }, (err) => {
            this.showToast('ERROR:' + err);//错误：无法使用拍照功能！
        });
    }
    public localPaths(data) {//返回的选取的本地照片地址
        return data
    }
    // 相册多选图
    public openImgPicker(n: number) {
        this.uploadSuccessReturn = [];
        this.imgList = [];
        if (this.platform.is('cordova')) {
            // 调用相册时传入的参数
            let imagePickerOpt = {
                maximumImagesCount: 9 - n,//选择一张图片
                width: 800,
                height: 800,
                quality:90
            };
            console.log('在移动设备环境，打开手机相册')
            this.imagePicker.getPictures(imagePickerOpt)
                .then((results) => {
                    console.log("相册获取的图片及其数量：", results)
                    console.log("开始返回选取的图片数量",results.length)
                    this.upload.imagePicNum(results.length);

                    this.imgList = results;
                    let basepath = [];
                    for (let i = 0; i < this.imgList.length; i++) {
                        this.base64.encodeFile(this.imgList[i]).then((base64File: string) => {
                            base64File = base64File.replace('data:image/*;charset=utf-8;base64', 'data:image/jpg;base64')
                            //  this.sanitizer.bypassSecurityTrustUrl(base64File)
                            basepath[i] = base64File;
                            if (basepath.length == this.imgList.length) {
                                console.log('转换完成的base64数组', basepath)
                                this.upload.localpath(basepath)
                            }
                        }, (err) => {
                            console.log(err);
                        })
                    }
                    console.log("即将开始进入上传递归",'传入路径',this.imgList[0],'传入总共长度：',this.imgList.length)
                    self.uploadImg(this.imgList[0], this.imgList.length,0);
                 
                }, (err) => {
                    console.log("打开相册失败")
                    this.showToast( err);//错误：无法从手机相册中选择图片！
                });
        } else {
            console.log('进入非设备环境，采用模拟数据')
            this.imgList = 
                 [
                     "http://img.zcool.cn/community/0117e2571b8b246ac72538120dd8a4.jpg@1280w_1l_2o_100sh.jpg",
                     "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539756072228&di=dd4bc0c2782dd07ad60d1c27a886aaaf&imgtype=0&src=http%3A%2F%2Fimgk.zol.com.cn%2Fdcbbs%2F9949%2Fa9948426.jpg"
                   
                ]
            this.imgList.forEach((img, index) => {
                //上传图片
                this.uploadSuccessReturn.push(img)
                console.log(this.imgList.length, index)
                if (index === this.imgList.length - 1) {
                    console.log('模拟上传成功：', this.uploadSuccessReturn)
                    // this.upload.localpath(this.uploadSuccessReturn)
                    this.upload.success(this.uploadSuccessReturn)
                }
            });

        }
    }


    // 上传图片  allNum-1 为当前素组大小  index 当前大小   相等时候就完成多图上传
    public uploadImg(path: string, allNum?: number, index?: number, callback?) {
        let upload: any = {
            fileKey: 'upload',//接收图片时的key
            fileName: 'imageName.jpg',
            mimeType: 'image/png',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',//不加入 发生错误！！
                'Content-Type': 'multipart/form-data'
            },
            params: {}, //需要额外上传的参数
            success: (data) => { },//图片上传成功后的回调
            error: (err) => { },//图片上传失败后的回调
            listen: () => { }//监听上传过程
        };
        console.log("上传图片", path)
        if (!path) {
            return;
        }
        let options: FileUploadOptions = {
            fileKey: 'upload',
            fileName: 'name.jpg',  // 文件类型
            mimeType: 'image/jpeg',
            params: {
                // 如果要传参数，写这里
                // formData:{customSize:true,width:800,height:800}
            }   
        }
        if (path.indexOf('?') == -1) {
            options.fileName = path;
        } else {
            options.fileName = path.substr(0, path.indexOf('?'));
            options.fileName = options.fileName.substr(options.fileName.lastIndexOf("/") + 1)
        }
        console.log(options)
        const myfileTransfer: FileTransferObject = this.myfileTransfer.create();
        console.log("实例化成功，进入调用")
        myfileTransfer.upload(path, encodeURI('https://img.inkey.club/upload/uploadhandler.ashx'), options)
            .then((data) => {
                // console.log('本图上传公共返回的数据',data)
                this.uploadSuccessReturn.push(((JSON.parse(data.response))[2].PictureUrl));
                console.log("当前上传返回的dataurl",((JSON.parse(data.response))[0].PictureUrl),'已经成功的上传地址集合uploadSuccessReturn：',this.uploadSuccessReturn);
                console.log('第'+index+'张上传：','传入的图片路径:',this.imgList[index])
                    if(index+1==allNum){
                        console.log('递归终止，返回数据',self.uploadSuccessReturn)
                        self.upload.success(self.uploadSuccessReturn)
                        return;
                    }
                    console.log('需要操作的所有图集',this.imgList)
                   self.uploadImg(this.imgList[index+1],allNum,index+1)
                   console.log('即将上传第'+(index+1)+'张：','传入的图片路径:',this.imgList[index+1])
            }, (err) => {
                console.log(err)
                if (upload.error) {
                    upload.error(err);
                    // loading.dismiss();
                } else {
                    this.showToast('错误：上传失败！');
                    // loading.dismiss();
                }
            });
            
        myfileTransfer.onProgress((event: ProgressEvent) => {
            console.log(" event.total :", event.loaded, " event.total :", event.total)
            let num = Math.floor(event.loaded / event.total * 100);
            console.log('上传进度', num)
            this.uploadImgProgress[index] = num;
            this.upload.listen(this.uploadImgProgress)
        });


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

