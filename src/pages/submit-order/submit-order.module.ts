import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubmitOrderPage } from './submit-order';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    SubmitOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SubmitOrderPage),
    PipesModule
  ],
})
export class SubmitOrderPageModule {}
