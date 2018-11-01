import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
 
import { ChangeUserNamePage } from '../change-user-name/change-user-name';

@NgModule({
  declarations: [
    ChangeUserNamePage
  ],
  imports: [
    IonicPageModule.forChild(ChangeUserNamePage),
  ],
})
export class ChangeUserNamePageModule {}
