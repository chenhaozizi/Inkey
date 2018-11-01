import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StateRecordPage } from './state-record';

@NgModule({
  declarations: [
    StateRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(StateRecordPage),
  ],
})
export class StateRecordPageModule {}
