import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { ResultsListComponent } from './components/results-list/results-list.component';
import { ResultComponent } from './components/result/result.component';
import { TrayComponent } from './components/tray/tray.component';
import { SurfaceComponent } from './components/surface/surface.component';

import { VideoService } from './services/video.service';

import { reducer } from './reducers/search.reducer';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore(reducer),
  ],
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsListComponent,
    ResultComponent,
    TrayComponent,
    SurfaceComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
