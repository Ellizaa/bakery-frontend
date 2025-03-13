import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {Router} from '@angular/router';
import { error } from 'console';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-manage-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {

  categories: any[] = []
  filteredProducts: any[] = []

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
  }

  applyFilter(categoryId: any){
    this.productService.getProductsByCategory(categoryId).subscribe((response: any) => {
      this.filteredProducts = response
    })
  }

  ngOnInit(): void {

    this.productService.getProducts().subscribe((response:any)=>{
      console.log(response)
    })


    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.categories = response
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
        'categoryId': product.categoryId,
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
