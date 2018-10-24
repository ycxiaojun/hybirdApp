import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SuggestionsPage } from './suggestions';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    SuggestionsPage,
  ],
  imports: [
    IonicPageModule.forChild(SuggestionsPage),
    PipesModule
  ],
})
export class SuggestionsPageModule {}
