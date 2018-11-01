import { NgModule } from '@angular/core';
import { CustomerListComponent } from './customer-list/customer-list';
import { BrowserModule } from "@angular/platform-browser";
import { IonicModule } from 'ionic-angular';
import { SortListComponent } from './sort-list/sort-list';
@NgModule({
	declarations: [CustomerListComponent, SortListComponent],
	imports: [BrowserModule, IonicModule],
	exports: [CustomerListComponent, SortListComponent]
})
export class ComponentsModule { }
