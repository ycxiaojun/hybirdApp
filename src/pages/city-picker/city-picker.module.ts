import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityPickerPage } from './city-picker';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    CityPickerPage,
  ],
  imports: [
    IonicPageModule.forChild(CityPickerPage),
    PipesModule
  ],
})
export class CityPickerPageModule {}
