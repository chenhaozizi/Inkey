import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivelistPage } from "../activelist/activelist"
@NgModule({
  declarations: [
    ActivelistPage
  ],
  imports: [
    IonicPageModule.forChild(ActivelistPage),
  ],
})
export class ActivelistPageModule { }
