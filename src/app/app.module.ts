import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SophizeMdRendererModule } from 'ngx-sophize-md-renderer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocalDataProvider } from './data-provider';
import { ResourceListPanelComponent } from './resource-list-panel/resource-list-panel.component';
import { ActionPanelComponent } from './action-panel/action-panel.component';
import { EditPanelComponent } from './edit-panel/edit-panel.component';
import { ExtractorViewComponent } from './extractor-view/extractor-view.component';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    ResourceListPanelComponent,
    ActionPanelComponent,
    EditPanelComponent,
    ExtractorViewComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    SophizeMdRendererModule.forRoot(LocalDataProvider),

    MatIconModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: 'LocalServerAddress', useValue: 'http://127.0.0.1:8080' },
  ],
})
export class AppModule {}
