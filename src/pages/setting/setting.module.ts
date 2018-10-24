import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [ 
    SettingPage,
  ],
  imports: [
      IonicPageModule.forChild(SettingPage),
      PipesModule
  ],
})
export class SettingPageModule {}
