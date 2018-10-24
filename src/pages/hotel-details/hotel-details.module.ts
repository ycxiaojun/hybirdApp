import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelDetailsPage } from './hotel-details';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    HotelDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelDetailsPage),
    PipesModule
  ],
})
export class HotelDetailsPageModule {}
