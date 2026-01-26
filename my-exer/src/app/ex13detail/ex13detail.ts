import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Productservice } from '../ex13/productservice';

@Component({
  selector: 'app-ex13detail',
  standalone: false,
  templateUrl: './ex13detail.html',
  styleUrl: './ex13detail.css',
})
export class Ex13detail {
selectedProduct:any
constructor(private activateRoute:ActivatedRoute,private _fs:Productservice,
private router:Router)
{
activateRoute.paramMap.subscribe(
(param)=>{
let id=param.get('id')
if(id!=null)
{
this.selectedProduct=_fs.getProductDetail(id)
}
}
)
}
goBack(){
this.router.navigate(['service-product-image-event'])
}
}
