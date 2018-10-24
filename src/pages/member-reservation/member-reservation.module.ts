import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberReservationPage } from './member-reservation';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MemberReservationPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberReservationPage),
    PipesModule
  ],
})
export class MemberReservationPageModule {}
