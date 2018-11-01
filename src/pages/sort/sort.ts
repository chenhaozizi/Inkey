import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SortinfoPage } from '../sortinfo/sortinfo';

/**
 * Generated class for the SortPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sort',
  templateUrl: 'sort.html',
})
export class SortPage {
  SortinfoPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.SortinfoPage=SortinfoPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SortPage');
  }

}
