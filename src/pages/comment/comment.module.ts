import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentPage } from './comment';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    CommentPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentPage),
    PipesModule
  ],
})
export class CommentPageModule {}
