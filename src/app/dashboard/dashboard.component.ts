import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import {ProductService} from "../services/product.service";
import {CategoryService} from "../services/category.service";
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {


  categories: any[] = []
  filteredProducts: any[] = []

	responseMessage: any;
	data: any;

  currentRole: string | null = ''

	ngAfterViewInit() {
    this.currentRole = localStorage.getItem("ROLE")
  }

	constructor(private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService,
    private productService: ProductService,
    private categoryService: CategoryService) {
			this.ngxService.start();
			this.dashboardData();

      this.categoryService.getCategorys().subscribe((response:any)=>{
        this.categories = response
      })
	}

  applyFilter(categoryId: any){
    this.productService.getProductsByCategory(categoryId).subscribe((response: any) => {
      this.filteredProducts = response
    })
  }

	dashboardData(){
		this.dashboardService.getDetails().subscribe((response:any)=>{
			this.ngxService.stop();
			this.data = response;
		},(error:any)=>{
			this.ngxService.stop();
			console.log(error);
			if(error.error?.message){
				this.responseMessage = error.error?.message;
			}
			else{
				this.responseMessage = GlobalConstants.genericError;
			}
			this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
		})
	}

}
