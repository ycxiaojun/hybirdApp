import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnterPasswordPage } from './enter-password';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    EnterPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(EnterPasswordPage),
    PipesModule
  ],
})
export class EnterPasswordPageModule {}
