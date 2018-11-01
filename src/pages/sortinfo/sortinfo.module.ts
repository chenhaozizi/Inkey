import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
///import { SortinfoPage } from './sortinfo';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
   // SortinfoPage,
  ],
  imports: [
    ComponentsModule,
    //IonicPageModule.forChild(SortinfoPage),
  ],
})
export class SortinfoPageModule {}
