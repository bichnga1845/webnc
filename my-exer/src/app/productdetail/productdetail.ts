import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productdetail',
  standalone: false,
  templateUrl: './productdetail.html',
  styleUrl: './productdetail.css',
})
export class Productdetail {
products=[
  {"id":"p1","name":"Coca","price":12000,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSix24hWNvdd23orosRpeVuJtlbkx9r5maQwQ&s"},
  {"id":"p2","name":"Pepsi","price":-11000,"img":"https://product.hstatic.net/200000534989/product/dsc08410-enhanced-nr_1_81edadf400df40fcbdcca8749abcbb90_master.jpg"},
  {"id":"p3","name":"7up","price":10000,"img":"https://i5.walmartimages.com/asr/1a2cfb06-b62a-4f7c-bf49-48d4ed102ab9.dcc6fbc9501d73638f0a181bbc047949.jpeg"},
  {"id":"p4","name":"Mirinda","price":9000,"img":"https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8934588882111-1-1.jpg.webp"},
    {"id":"p5","name":"Fanta","price":-9500,"img":"https://cdn.tgdd.vn/Products/Images/2321/263083/fanta-huong-cam-chai-1-5lt-202203101123215437.jpg"},

]
product_selected:any
constructor(private router:Router, private route:ActivatedRoute)
{
  // dung router de dieu huong
  //dung activerouter de nhan dieu huong
  this.route.paramMap.subscribe(params=>{
    let id=params.get("id");
    this.product_selected=this.products.find(p=>p.id==id);
  });
}
goBack()
{
  this.router.navigate(["listproduct", {id: this.product_selected.id}]);
}
}
  