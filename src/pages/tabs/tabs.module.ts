import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
	declarations: [
		TabsPage,
	],
	imports: [
		IonicPageModule.forChild(TabsPage),
		PipesModule
	],
})
export class TabsPageModule { }
