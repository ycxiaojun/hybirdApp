import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotelCommentPage } from './hotel-comment';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    HotelCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(HotelCommentPage),
    PipesModule
  ],
})
export class HotelCommentPageModule {}
