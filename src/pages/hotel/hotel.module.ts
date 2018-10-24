import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelPage } from './hotel';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    HotelPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelPage),
    PipesModule
  ],
})
export class HotelPageModule {}
