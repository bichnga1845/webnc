import { Component } from '@angular/core';
import { FashionAPIService } from '../myservices/fashion-apiservice';

@Component({
  selector: 'app-fashion-component',
  standalone: false,
  templateUrl: './fashion-component.html',
  styleUrl: './fashion-component.css',
})
export class FashionComponent {
  fashions:any;
  errMessage:string=''
  constructor(public _service: FashionAPIService){
  this._service.getFashions().subscribe({
  next:(data)=>{this.fashions=data},
  error:(err)=>{this.errMessage=err}
})
}

parse_image(base64str:string)
{
  let prefix="data:image/jpeg;base64,"
  if(base64str.startsWith(prefix))
  {
    return base64str;
  }
  else
  {
    return prefix + base64str;
  }
}
}
