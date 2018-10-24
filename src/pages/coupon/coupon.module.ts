import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CouponPage } from './coupon';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    CouponPage,
  ],
  imports: [
    IonicPageModule.forChild(CouponPage),
    PipesModule
  ],
})
export class CouponPageModule {}
