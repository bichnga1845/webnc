import { Component } from '@angular/core';
import { FakeProductService } from '../myservices/fake-product-service';

@Component({
  selector: 'app-fake-product',
  standalone: false,
  templateUrl: './fake-product.html',
  styleUrl: './fake-product.css',
})
export class FakeProduct {
  data:any = []
  errMessage:string=''
  constructor(private _service:FakeProductService){
    console.log('FakeProduct component initialized');
    this._service.getFakeProductData().subscribe({
      next:(data)=> { 
        console.log('Data received:', data);
        this.data=data
      },
      error:(err)=>{
        console.error('Error occurred:', err);
        this.errMessage=err
      }
    })
  }
}
