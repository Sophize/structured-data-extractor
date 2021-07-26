import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExtractorViewComponent } from './extractor-view/extractor-view.component';
import { HomeComponent } from './home/home.component';
import { LatexToMdComponent } from './latex-to-md/latex-to-md.component';

const routes: Routes = [
  { path: 'extract', component: ExtractorViewComponent },
  { path: 'convert', component: LatexToMdComponent },
  { path: '**', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
