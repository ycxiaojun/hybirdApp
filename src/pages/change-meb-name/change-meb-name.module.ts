import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeMebNamePage } from './change-meb-name';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    ChangeMebNamePage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeMebNamePage),
    PipesModule
  ],
})
export class ChangeMebNamePageModule { }
