import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalHotelFilterPage } from './modal-hotel-filter';
import { ComponentsModule } from "./../../components/components.module";
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    ModalHotelFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalHotelFilterPage),
    ComponentsModule,
    PipesModule
  ],
})
export class ModalHotelFilterPageModule {}
