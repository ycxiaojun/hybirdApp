import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePickerPage } from './date-picker';
import { ComponentsModule } from "./../../components/components.module";
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    DatePickerPage
  ],
  imports: [
    IonicPageModule.forChild(DatePickerPage),
    ComponentsModule,
    PipesModule
  ],
})
export class DatePickerPageModule {}
