import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AppService } from "../../app/app.service";

/**
 * Generated class for the MsgInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-msg-info',
  templateUrl: 'msg-info.html',
})
export class MsgInfoPage {
  item;
  show_id;
  msg;
  user_token;
  constructor(public navCtrl: NavController, public navParams: NavParams, public domSanitizer: DomSanitizer, public appService: AppService) {
    this.show_id = navParams.get("id");
    this.appService.getItem('user_token', res => {
      this.user_token = res
    })
    this.item = []
  }
  ngOnInit() {
    this.getMsginfo();
  }
  getMsginfo() {
    let pra = { 'pushMessageId': this.show_id }
    this.appService.httpGet('/Api/Home/GetMessageInfo', pra, res => {
      console.log(res.Item.Message)
      if (res) {
        res.Item.CreateTime = this.appService.getNowFormatDate(res.Item.CreateTime, true);
        this.item = res.Item;
      }
    }, true, this.user_token)


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MsgInfoPage');
  }

  assembleHTML(strHTML: any) {
    return this.domSanitizer.bypassSecurityTrustHtml(strHTML);
  }
}
