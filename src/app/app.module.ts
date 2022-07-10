import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AppComponent } from './app.component';
import { StrategyComponent } from './strategy/strategy.component';
import { MaterialModule } from './material.module';
import { NotifierService, NotifierOptions, NotifierModule } from 'angular-notifier';
import { FlexLayoutModule } from "@angular/flex-layout";
import { CreateStrategyComponent } from './strategy/create-strategy/create-strategy.component';
import { StrategyService } from './strategy/strategy.service';
import { TechnicalConditionComponent } from './technical-condition/technical-condition.component';
import { TechnicalDetailDialogComponent } from './technical/technical-detail-dialog/technical-detail-dialog.component'
import { TechnicalComponent } from './technical/technical.component';
import { TechnicalSearchComponent } from './technical/technical-search/technical-search.component';
import { CreateTechnicalComponent } from './technical/create-technical/create-technical.component';
import { TechnicalOperatorComponent } from './technical-operator/technical-operator.component';
import { InstrumentComponent } from './instrument/instrument.component';
import { InstrumentTagInputComponent } from './instrument/instrument-tag-input/instrument-tag-input.component';
import { NavigationComponent } from './navigation/navigation.component';
import { BacktestDialogComponent } from './strategy/backtest-dialog/backtest-dialog.component';
import { CreateTechnicalOperatorComponent } from './technical-operator/create-technical-operator/create-technical-operator.component';
import { FilterPipe } from './pipes/filter.pipe';
import { DerivativeResultsComponent } from './derivative-results/derivative-results.component';
import {DerivativeAnalysisDetailComponent} from './derivative-results/derivative-analysis-detail/derivative-analysis-detail.component';
import { ChartsModule } from 'ng2-charts';
import { InstrumentSelectorComponent } from './instrument/instrument-selector/instrument-selector.component';
import { ScreenerComponent } from './screener/screener.component';
import { CreateScreenerComponent } from './screener/create-screener/create-screener.component';
import { ScreenerResultComponent } from './screener/screener-result/screener-result.component';
import { StockSelectionComponent } from './stock-selection/stock-selection.component';
import { StockSelectorDialogComponent } from './stock-selection/stock-selector-dialog/stock-selector-dialog.component';
import { StockSelectionService } from './stock-selection/stock-selection.service';
import { TrapScrollDirective } from './directives/trap-scroll.directive';

const notifierDefaultOptions: NotifierOptions = {
   position: {
       horizontal: {
           position: "right",
           distance: 12
       },
       vertical: {
           position: "bottom",
           distance: 12,
           gap: 10
       }
   },
   theme: "material",
   behaviour: {
       autoHide: 3000,
       onClick: false,
       onMouseover: "pauseAutoHide",
       showDismissButton: true,
       stacking: 4
   },
   animations: {
       enabled: true,
       show: {
           preset: "slide",
           speed: 300,
           easing: "ease"
       },
       hide: {
           preset: "fade",
           speed: 1000,
           easing: "ease",
       },
       shift: {
           speed: 300,
           easing: "ease"
       },
       overlap: 150
   }
 };

@NgModule({
   declarations: [
      AppComponent,
      StrategyComponent,
      CreateStrategyComponent,
      TechnicalConditionComponent,
      TechnicalComponent,
      TechnicalSearchComponent,
      CreateTechnicalComponent,
      TechnicalOperatorComponent,
      InstrumentComponent,
      InstrumentTagInputComponent,
      TechnicalDetailDialogComponent,
      CreateTechnicalOperatorComponent,
      NavigationComponent,
      BacktestDialogComponent,
      FilterPipe,
      DerivativeResultsComponent,
      DerivativeAnalysisDetailComponent,
      InstrumentSelectorComponent,
      ScreenerComponent,
      CreateScreenerComponent,
      ScreenerResultComponent,
      StockSelectionComponent,
      StockSelectorDialogComponent,
      TrapScrollDirective
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      MaterialModule,
      HttpClientModule,
      NotifierModule.withConfig(notifierDefaultOptions),
      FlexLayoutModule,
      FormsModule,
      ReactiveFormsModule,
      OwlDateTimeModule,
      OwlNativeDateTimeModule,
      ChartsModule
   ],
   schemas: [
      NO_ERRORS_SCHEMA
   ],
   providers: [
      NotifierService,
      StrategyService,
      StockSelectionService
   ],
   entryComponents: [
      TechnicalDetailDialogComponent,
      BacktestDialogComponent,
      StockSelectorDialogComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
