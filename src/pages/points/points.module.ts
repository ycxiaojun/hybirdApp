import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointsPage } from './points';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    PointsPage,
  ],
  imports: [
    IonicPageModule.forChild(PointsPage),
    PipesModule
  ],
})
export class PointsPageModule {}
