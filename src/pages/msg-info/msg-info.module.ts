import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgInfoPage } from './msg-info';

@NgModule({
  declarations: [
    MsgInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MsgInfoPage),
  ],
})
export class MsgInfoPageModule {}
