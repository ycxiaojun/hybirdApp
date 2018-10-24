import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberBillPage } from './member-bill';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MemberBillPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberBillPage),
    PipesModule
  ],
})
export class MemberBillPageModule {}
