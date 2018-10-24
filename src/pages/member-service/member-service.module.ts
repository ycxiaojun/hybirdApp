import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberServicePage } from './member-service';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    MemberServicePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberServicePage),
    PipesModule
  ],
})
export class MemberServicePageModule {}
