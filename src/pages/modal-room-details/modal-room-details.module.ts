import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalRoomDetailsPage } from './modal-room-details';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    ModalRoomDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalRoomDetailsPage),
    PipesModule
  ],
})
export class ModalRoomDetailsPageModule {}
