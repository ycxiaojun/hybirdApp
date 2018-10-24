import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberInfoPage } from './member-info';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MemberInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberInfoPage),
    PipesModule
  ],
})
export class MemberInfoPageModule {}
