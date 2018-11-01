import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CardPage } from '../card/card';

@NgModule({
  declarations: [
    CardPage
  ],
  imports: [
    IonicPageModule.forChild(CardPage),
  ],
})
export class CardPageModule {}
