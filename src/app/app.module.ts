import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/tiles/search/search.component';
import { SearchFieldComponent } from './components/tiles/search/search-field/search-field.component';
import { ResultsListComponent } from './components/tiles/search/results-list/results-list.component';
import { ResultComponent } from './components/tiles/search/result/result.component';
import { TrayComponent } from './components/tray/tray.component';
import { TrayItemComponent } from './components/tray-item/tray-item.component';
import { SurfaceComponent } from './components/surface/surface.component';
import { GridComponent } from './components/grid/grid.component';
import { TileComponent } from './components/tile/tile.component';
import { PlaybackComponent } from './components/tiles/playback/playback.component';

import { VideoService } from './services/video.service';
import { GridService } from './services/grid.service';

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
    SearchFieldComponent,
    ResultsListComponent,
    ResultComponent,
    TrayComponent,
    TrayItemComponent,
    SurfaceComponent,
    GridComponent,
    TileComponent,
    PlaybackComponent,
  ],
  entryComponents: [
    PlaybackComponent,
    ResultsListComponent,
    SearchComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
