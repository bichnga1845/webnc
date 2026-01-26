import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Customerdetail } from './customerdetail/customerdetail';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { HttpClientModule } from '@angular/common/http';
import { Ex14catelog } from './ex14catelog/ex14catelog';
import { About } from './about/about';
import { Notfound } from './notfound/notfound';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import { Ex13 } from './ex13/ex13';
import { Ex13detail } from './ex13detail/ex13detail';
import { Ex18 } from './ex18/ex18';
import { FakeProduct } from './fake-product/fake-product';
import { FakeProductex27 } from './fake-productex27/fake-productex27';

@NgModule({
  declarations: [
    App,
    Listcustomer,
    Listcustomer2,
    Customerdetail,
    Listcustomer3,
    About,
    Notfound,
    Listproduct,
    Productdetail,
    Ex13,
    Ex13detail,
    FakeProduct,
    FakeProductex27,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    Ex14catelog,
    Ex18
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule {}
