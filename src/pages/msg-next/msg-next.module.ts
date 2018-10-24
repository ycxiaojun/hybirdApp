import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgNextPage } from './msg-next';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MsgNextPage,
  ],
  imports: [
    IonicPageModule.forChild(MsgNextPage),
    PipesModule
  ],
})
export class MsgNextPageModule {}
