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

  recommendProducts: any[] = []

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

      const user: any = JSON.parse(localStorage.getItem('user')  as string)
      this.productService.getRecommendProducts(user.id).subscribe((response: any) => {
        this.recommendProducts = response.recommended_products
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

  handleBuyAction(product: any) {
    let productCartJson = localStorage.getItem("PRODUCT_CART");
    let productCart: any[] = [];
    if (productCartJson) {
      productCart = JSON.parse(productCartJson);
    }

    // Check if the productId already exists in the cart
    const productExists = productCart.some(item => item.productId === product.id);
    if (!productExists) {
      productCart.push({
        'productId': product.id,
        'categoryId': product.category_id,
        'amount': Math.round(product.amount)
      });
      localStorage.setItem("PRODUCT_CART", JSON.stringify(productCart));
      this.snackbarService.openSnackBar("Successfully added","succedd");
    } else {
      console.log("Product is already in the cart");
      this.snackbarService.openSnackBar("Ooops... already exists","succedd");
    }
  }

}
