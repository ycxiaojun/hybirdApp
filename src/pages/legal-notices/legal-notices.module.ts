import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LegalNoticesPage } from './legal-notices';
import { PipesModule } from '../../pipe/pipes.module';

@NgModule({
  declarations: [
    LegalNoticesPage,
  ],
  imports: [
    IonicPageModule.forChild(LegalNoticesPage),
    PipesModule
  ],
})
export class LegalNoticesPageModule {}
