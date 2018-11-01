import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddactivePage } from "../addactive/addactive"

@NgModule({
  declarations: [
    AddactivePage
  ],
  imports: [
    IonicPageModule.forChild(AddactivePage),
  ],
})
export class AddactivePageModule {}
