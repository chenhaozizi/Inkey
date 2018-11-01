import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardSharePage } from './card-share';

@NgModule({
  declarations: [
    CardSharePage,
  ],
  imports: [
    IonicPageModule.forChild(CardSharePage),
  ],
})
export class CardSharePageModule {}
