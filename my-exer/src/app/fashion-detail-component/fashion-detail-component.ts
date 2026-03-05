import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FashionAPIService } from '../myservices/fashion-apiservice';

@Component({
  selector: 'app-fashion-detail-component',
  standalone: false,
  templateUrl: './fashion-detail-component.html',
  styleUrl: './fashion-detail-component.css',
})
export class FashionDetailComponent implements OnInit {
  fashion:any;
  errMessage:string='';
  fashionId:string='';

  constructor(
    private _route: ActivatedRoute,
    private _service: FashionAPIService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fashionId = this._route.snapshot.params['id'];
    console.log('Fashion ID:', this.fashionId);
    this._service.getFashion(this.fashionId).subscribe({
      next: (data) => { 
        console.log('Fashion data:', data);
        this.fashion = data;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (err) => { 
        console.log('Error:', err);
        this.errMessage = err;
        this.cdr.detectChanges();
      }
    });
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
