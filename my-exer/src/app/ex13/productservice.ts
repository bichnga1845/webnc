import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Productservice {
  productsImage=[
{"ProductId":"p1","ProductName":"Coca","Price":100,"Image":"../images/coca.jpg"},
{"ProductId":"p2","ProductName":"Pepsi","Price":300,"Image":"../images/pepsi.jpg"},
{"ProductId":"p3","ProductName":"Sting","Price":200,"Image":"../images/sting.jpg"},
]
constructor() { }
getProductsWithImages()
{
return this.productsImage
}
getProductDetail(id:any){
return this.productsImage.find(x=>x.ProductId==id)
}

}
