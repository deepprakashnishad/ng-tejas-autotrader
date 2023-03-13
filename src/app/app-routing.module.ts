import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StrategyComponent } from './strategy/strategy.component';
import { CreateStrategyComponent } from './strategy/create-strategy/create-strategy.component';
import { CreateTechnicalComponent } from './technical/create-technical/create-technical.component';
import { CreateTechnicalOperatorComponent } from './technical-operator/create-technical-operator/create-technical-operator.component';
import { DerivativeResultsComponent } from './derivative-results/derivative-results.component'
import { DerivativeAnalysisDetailComponent} from './derivative-results/derivative-analysis-detail/derivative-analysis-detail.component';
import { ScreenerComponent } from './screener/screener.component';
import { CreateScreenerComponent } from './screener/create-screener/create-screener.component';
import { ScreenerResultComponent } from './screener/screener-result/screener-result.component'
import { StockSelectionComponent } from './stock-selection/stock-selection.component';
import { LoginComponent } from './authentication/login/login.component';
import { LiveIndexAnalysisComponent } from './live-index-analysis/live-index-analysis.component';
import { KiteAuthenticationComponent } from './authentication/kite-authentication/kite-authentication.component';

const routes: Routes = [
  	{
		path: '', component: StrategyComponent, data:{title: 'Strategy List', isSidenav: false}
	},
	{
		path: 'strategy', 
		component: StrategyComponent,  
		data: {
			title: 'Strategies'
		}
	},
	{
		path: 'strategy/my-strategies', 
		component: StrategyComponent,  
		data: {
			title: 'My Strategies'
		}
	},	
	{
		path: 'strategy/create', 
		component: CreateStrategyComponent,  
		data: {
			title: 'Create New Strategy'
		}
	},
	{
		path: 'strategy/create/:id', 
		component: CreateStrategyComponent,  
		data: {
			title: 'Create Strategy'
		}
	},
	{
		path: 'strategy/update/:id', 
		component: CreateStrategyComponent,  
		data: {
			title: 'Update Strategy'
		}
	},
	{
		path: 'technical/create', 
		component: CreateTechnicalComponent,  
		data: {
			title: 'Technical Form'
		}
	},
	{
		path: 'operator/create', 
		component: CreateTechnicalOperatorComponent,  
		data: {
			title: 'Operator Form'
		}
	},
	{
		path: 'derivative', 
		component: DerivativeResultsComponent,  
		data: {
			title: 'Derivative Results'
		}
	},
	{
		path: 'derivative/detail/:stock', 
		component: DerivativeAnalysisDetailComponent,  
		data: {
			title: 'DA Detail'
		}
	},
	{
		path: 'screener', 
		component: ScreenerComponent,  
		data: {
			title: 'Screener List'
		}
	},
	{
		path: 'screener/create', 
		component: CreateScreenerComponent,  
		data: {
			title: 'Create Screener'
		}
	},
	{
		path: 'screener/create/:screener_id', 
		component: CreateScreenerComponent,  
		data: {
			title: 'Create Screener'
		}
	},
	{
		path: 'screener/update/:screener_id', 
		component: CreateScreenerComponent,  
		data: {
			title: 'Update Screener'
		}
	},
	{
		path: 'screener/result/:screener_id', 
		component: ScreenerResultComponent,  
		data: {
			title: 'Screener Result'
		}
	},
	{
		path: 'dailyStocks', 
		component: StockSelectionComponent,  
		data: {
			title: 'Selected Stocks'
		}
	},
	{
		path: 'login', 
		component: LoginComponent,  
		data: {
			title: 'Login'
		}
	},
	{
		path: 'kite/verify_login', 
		component: KiteAuthenticationComponent,  
		data: {
			title: 'Authentication'
		}
	},
	{
		path: 'live-index-analysis', 
		component: LiveIndexAnalysisComponent,  
		data: {
			title: 'Live Index Analysis'
		}
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  
}
