import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SophizeMdRendererModule } from 'ngx-sophize-md-renderer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    SophizeMdRendererModule.forRoot('http://127.0.0.1:8080'),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
