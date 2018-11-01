import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppService } from './../../app/app.service';

import { AppVersion } from "@ionic-native/app-version";

/**
 * Generated class for the AboutAppPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-about-app',
  templateUrl: 'about-app.html',
})
export class AboutAppPage {
  version;

  ip_version;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appService: AppService,public appVersion:AppVersion) {
    this.appService.getItem("loc_version",res=>{
        this.version=res
        console.log(res,this.version)
    })
   
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutAppPage');
  }

}
