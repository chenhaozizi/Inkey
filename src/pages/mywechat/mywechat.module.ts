import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MywechatPage } from './mywechat';

@NgModule({
  declarations: [
    MywechatPage,
  ],
  imports: [
    IonicPageModule.forChild(MywechatPage),
  ],
})
export class MywechatPageModule {}
