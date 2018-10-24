import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepositPage } from './deposit';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    DepositPage,
  ],
  imports: [
    IonicPageModule.forChild(DepositPage),
    PipesModule
  ],
})
export class DepositPageModule {}
