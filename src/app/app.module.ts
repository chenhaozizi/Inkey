import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { File } from '@ionic-native/file';//目录读取
import { Transfer, TransferObject } from '@ionic-native/transfer';//用于下载服务器apk
import { FileOpener } from '@ionic-native/file-opener';//用于打开指定目录的apk进行安装
import { AppVersion } from '@ionic-native/app-version';//用于获取当前app版本
import { AndroidPermissions } from '@ionic-native/android-permissions';//安卓权限
import { Camera } from '@ionic-native/camera';//相机 相册
import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';//base64
import { JPush } from '@jiguang-ionic/jpush';
import { Device } from '@ionic-native/device';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeService } from '../providers/NativeService';
import { Badge } from '@ionic-native/badge';
import { ImgService } from "../app/app.img.service";
import { MyApp } from './app.component';
import { AppShare } from './app.share'
import { HttpModule } from '@angular/http';
import { JpushUtil } from '../providers/JpushUtil'
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { ActionSheet } from '@ionic-native/action-sheet';
import { FileTransfer } from '@ionic-native/file-transfer';
// import { FilePath } from '@ionic-native/file-path';
// 所有新建的文件都需要在这里引入才能被使用，并且在下面的
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SharePage } from '../pages/share/share';

import { LoginPage } from '../pages/login/login';
import { CustomerPage } from '../pages/customer/customer';
import { CustomersPage } from '../pages/customers/customers';
import { SettingPage } from '../pages/setting/setting';
import { SortinfoPage } from '../pages/sortinfo/sortinfo';
import { AppService } from './app.service';
import { AppStorage } from './storage.service';
import { CustomerStarPage } from '../pages/customer-star/customer-star'
// import { AddactivePage } from "../pages/addactive/addactive"//创建活动
import { CustomerAutoPage } from "../pages/customer-auto/customer-auto"//自然到店顾客
import { ModalTemplatePage } from "../pages/modal-template/modal-template";
import { ComponentsModule } from "../components/components.module";
import { CardSharePage } from "../pages/card-share/card-share";
import { PhotoLibrary } from '@ionic-native/photo-library';
//装饰器 在这里注入会用到的页面
@NgModule({
	// providers: 这个选项是一个数组,需要我们列出我们这个模块的一些需要共用的服务
	//            然后我们就可以在这个模块的各个组件中通过依赖注入使用了.

	// declarations: 数组类型的选项, 用来声明属于这个模块的指令,管道等等.
	//               然后我们就可以在这个模块中使用它们了.
	declarations: [ //注入的模块
		MyApp,
		HomePage,
		TabsPage,
		LoginPage,
		SharePage,
		SettingPage,
		CustomerPage,
		CustomersPage,
		CustomerStarPage,
		SortinfoPage,
		CustomerAutoPage,
		ModalTemplatePage,
		
	],
	// imports: 数组类型的选项,我们的模块需要依赖的一些其他的模块,这样做的目的使我们这个模块
	//          可以直接使用别的模块提供的一些指令,组件等等.
	imports: [ //导出的模块
		BrowserModule,
		HttpModule,
		HttpClientModule,
		ComponentsModule,
		IonicModule.forRoot(MyApp, {
			iconMode: 'ios',                  //引用iOS的图标
			modalEnter: 'modal-slide-in',     //设置返回的动画效果
			modalLeave: 'modal-slide-out',    //设置返回的动画效果
			backButtonText: '',      //设置返回按钮的文本
			mode: "ios"
		}),
		IonicStorageModule.forRoot()

	],
	bootstrap: [IonicApp],
	entryComponents: [ //数组类型的选项,指定一系列的组件,这些组件将会在这个模块定义的时候进行编译
		MyApp,
		HomePage,
		TabsPage,
		SharePage,
		LoginPage,
		SettingPage,
		CustomerPage,
		CustomerStarPage,
		CustomersPage,
		SortinfoPage,
		CustomerAutoPage,
		ModalTemplatePage,
		
	],
	providers: [
		AppShare,
		StatusBar,
		SplashScreen,
		File,
		// FilePath,
		JpushUtil,
		Transfer,
		FileTransfer,
		FileOpener,
		AppVersion,
		ImgService,
		Base64,
		InAppBrowser,
		NativeService,
		AndroidPermissions,
		Camera,
		ImagePicker,
		TransferObject,
		JPush, Device, LocalNotifications, Badge,PhotoLibrary,
		{
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		},
		AppService,
		AppStorage,
		ActionSheet
	]
})
export class AppModule { }
