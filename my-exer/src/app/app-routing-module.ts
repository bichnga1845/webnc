import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Ex10LunarYearComponent } from './lunar-year/lunar-year';
import { About } from './about/about';
import { Listcustomer } from './listcustomer/listcustomer';
import { Listcustomer2 } from './listcustomer2/listcustomer2';
import { Listcustomer3 } from './listcustomer3/listcustomer3';
import { Notfound } from './notfound/notfound';
import { Listproduct } from './listproduct/listproduct';
import { Productdetail } from './productdetail/productdetail';
import { Ex13detail } from './ex13detail/ex13detail';
import { Ex13 } from './ex13/ex13';
import { Ex18 } from './ex18/ex18';
import { FakeProduct } from './fake-product/fake-product';
import { FakeProductex27 } from './fake-productex27/fake-productex27';


const routes: Routes = [
  {path:"gioi-thieu",component:About},
  {path:"listcustomer",component:Listcustomer},
  {path:"listcustomer2",component:Listcustomer2},
  {path:"listcustomer3",component:Listcustomer3},
  {path:"listproduct",component:Listproduct},
  {path:"productdetail/:id",component:Productdetail},

  //ex13
  {path:'service-product-image-event',component:Ex13},
  {path:'service-product-image-event/:id',component:Ex13detail},

  //ex18
  {path:'ex18',component:Ex18},
  
  //ex26
  {path:'ex26',component:FakeProduct},

  //ex27
  {path:'ex27',component: FakeProductex27},






  {path:"**",component: Notfound}, //luôn để cuối cùng, mục đích để ngăn ai đó phá

  // { path: 'lunar', component: Ex10LunarYearComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
