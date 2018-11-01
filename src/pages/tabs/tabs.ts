import { Component,ViewChild } from '@angular/core';
import {Tabs} from 'ionic-angular'
import { HomePage } from '../home/home';
import { SettingPage } from "../setting/setting";
import {  SharePage } from "../share/share";
import { CustomerPage } from "../customer/customer";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabRoots: Object[];
  @ViewChild('myTabs') tabRef: Tabs;
  constructor() {
    this.tabRoots = [
      {
        root: HomePage,
        tabTitle: '首页',
        tabIcon: 'test3', 
        tabBadgeStyle:'#05afd0'
      }
      ,
      {
        root:  SharePage,
        tabTitle: '盈客圈',
        tabIcon: 'test',
        tabBadgeStyle:'#05afd0'
      }      ,
      {
        root: CustomerPage,
        tabTitle: '顾客',
        tabIcon: 'test2',
        tabBadgeStyle:'#05afd0'
      }
      ,
      {
        root: SettingPage,
        tabTitle: '个人中心',
        tabIcon: 'test1',
        tabBadgeStyle:'#05afd0'
      }
    ];
  
  }
  ionViewDidEnter() {
    this.tabRef.select(0);
   }
 
}