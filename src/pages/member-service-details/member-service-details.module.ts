import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberServiceDetailsPage } from './member-service-details';

@NgModule({
  declarations: [
    MemberServiceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberServiceDetailsPage),
  ],
})
export class MemberServiceDetailsPageModule {}
