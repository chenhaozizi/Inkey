import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
//import { CustomerStarPage } from './customer-star';
import { ComponentsModule } from "../../components/components.module";
@NgModule({
  declarations: [
   // CustomerStarPage
  ],
  imports: [
   ComponentsModule,
    //IonicPageModule.forChild(CustomerStarPage),
  ],
})
export class CustomerStarPageModule {}
