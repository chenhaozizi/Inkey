import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
 import {CouponListPagedPage} from '../coupon-list-paged/coupon-list-paged'

@NgModule({
  declarations: [
    CouponListPagedPage
    
  ],
  imports: [
    IonicPageModule.forChild(CouponListPagedPage),
  ],
})
export class CouponListPagedPageModule {}
