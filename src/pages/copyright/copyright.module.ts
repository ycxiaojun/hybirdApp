import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CopyrightPage } from './copyright';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    CopyrightPage,
  ],
  imports: [
    IonicPageModule.forChild(CopyrightPage),
    PipesModule
  ],
})
export class CopyrightPageModule {}
