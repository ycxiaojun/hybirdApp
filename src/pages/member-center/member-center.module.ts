import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberCenterPage } from './member-center';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MemberCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberCenterPage),
    PipesModule
  ],
})
export class MemberCenterPageModule {}
