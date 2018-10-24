import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCouponPage } from './select-coupon';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    SelectCouponPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectCouponPage),
    PipesModule
  ],
})
export class SelectCouponPageModule {}
