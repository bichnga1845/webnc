import { Component } from '@angular/core';
import { FakeProductService } from '../myservices/fake-product-service';

@Component({
  selector: 'app-fake-productex27',
  standalone: false,
  templateUrl: './fake-productex27.html',
  styleUrl: './fake-productex27.css',
})
export class FakeProductex27 {
  data:any = []
  errMessage:string=''
  constructor(private _service:FakeProductService){
   this._service.getFakeProductData().subscribe({
      next:(data)=>{ 
        this.data=data},
      error:(err)=>{
        this.errMessage=err
}
})
}
}
