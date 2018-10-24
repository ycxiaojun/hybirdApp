import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MsgPage } from './msg';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MsgPage,
  ],
  imports: [
      IonicPageModule.forChild(MsgPage),
      PipesModule
  ],
})
export class MsgPageModule {}
