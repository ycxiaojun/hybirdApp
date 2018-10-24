import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMebRoomServicePage } from './add-meb-room-service';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    AddMebRoomServicePage,
  ],
  imports: [
    IonicPageModule.forChild(AddMebRoomServicePage),
    PipesModule
  ],
})
export class AddMebRoomServicePageModule {}
