import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationPage } from './reservation';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    ReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(ReservationPage),
    PipesModule
  ],
})
export class ReservationPageModule {}
