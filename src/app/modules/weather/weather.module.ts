import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WeatherComponent } from './component/weather.component';

// Angular Material
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    MatExpansionModule,
    MatTableModule,
    MatProgressBarModule
  ],
  exports: [
    WeatherComponent
  ],
  providers: []
})
export class WeatherModule { }
