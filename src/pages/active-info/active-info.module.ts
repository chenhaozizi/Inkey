import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActiveInfoPage } from './active-info';

@NgModule({
  declarations: [
    ActiveInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ActiveInfoPage),
  ],
})
export class ActiveInfoPageModule {}
