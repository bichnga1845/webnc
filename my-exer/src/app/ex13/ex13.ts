import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Productservice } from './productservice';
@Component({
  selector: 'app-ex13',
  standalone: false,
  templateUrl: './ex13.html',
  styleUrl: './ex13.css',
})
export class Ex13 {
public products:any
constructor(pservice: Productservice,private router:Router){
this.products=pservice.getProductsWithImages()
}
viewDetail(f:any)
{
this.router.navigate(['service-product-image-event',f.ProductId])
}
}