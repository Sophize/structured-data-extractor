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
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LanguageSelectorComponent } from './form-elements/language-selector/language-selector.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StringListSelectorComponent } from './form-elements/string-list-selector/string-list-selector.component';
import { ResourceListSelectorComponent } from './form-elements/resource-list-selector/resource-list-selector.component';
import { MiniResourceDisplayComponent } from './form-elements/mini-resource-display/mini-resource-display.component';
import { LatexToMdComponent } from './latex-to-md/latex-to-md.component';
import { PtrPickerComponent } from './form-elements/ptr-picker/ptr-picker.component';
import { LinkBuilderComponent } from './form-elements/link-builder/link-builder.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourceListPanelComponent,
    ActionPanelComponent,
    EditPanelComponent,
    ExtractorViewComponent,
    HomeComponent,
    LanguageSelectorComponent,
    StringListSelectorComponent,
    ResourceListSelectorComponent,
    MiniResourceDisplayComponent,
    LatexToMdComponent,
    PtrPickerComponent,
    LinkBuilderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,

    SophizeMdRendererModule.forRoot(LocalDataProvider),

    MatButtonModule,
    
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: 'LocalServerAddress', useValue: 'http://127.0.0.1:8080' },
  ],
})
export class AppModule {}
