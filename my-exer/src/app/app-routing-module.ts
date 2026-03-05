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
import { Ex28 } from './ex28/ex28';
import { Ex21 } from './ex21/ex21';
import { Ex22 } from './ex22/ex22';
import { Books } from './books/books';
import { BookDetailComponent } from './book-detail-component/book-detail-component';
import { FileUploadComponent } from './file-upload-component/file-upload-component';
import { NewBookComponent } from './new-book-component/new-book-component';
import { BookManagementEx50 } from './book-management-ex50/book-management-ex50';
import { BookUpdate } from './book-update/book-update';
import { FashionComponent } from './fashion-component/fashion-component';
import { FashionDetailComponent } from './fashion-detail-component/fashion-detail-component';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { AuthGuard } from './guards/auth.guard';
import { MomoPaymentComponent } from './momo-payment/momo-payment';
import { ProductListComponent } from './product-list/product-list';
import { CartComponent } from './cart/cart';


const routes: Routes = [
  {path:"",redirectTo:"/login",pathMatch:"full"},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"gioi-thieu",component:About,canActivate:[AuthGuard]},
  {path:"listcustomer",component:Listcustomer,canActivate:[AuthGuard]},
  {path:"listcustomer2",component:Listcustomer2,canActivate:[AuthGuard]},
  {path:"listcustomer3",component:Listcustomer3,canActivate:[AuthGuard]},
  {path:"listproduct",component:Listproduct,canActivate:[AuthGuard]},
  {path:"productdetail/:id",component:Productdetail,canActivate:[AuthGuard]},

  //ex13
  {path:'service-product-image-event',component:Ex13,canActivate:[AuthGuard]},
  {path:'service-product-image-event/:id',component:Ex13detail,canActivate:[AuthGuard]},

  //ex18
  {path:'ex18',component:Ex18,canActivate:[AuthGuard]},
  
  //ex26
  {path:'ex26',component:FakeProduct,canActivate:[AuthGuard]},

  //ex27
  {path:'ex27',component: FakeProductex27,canActivate:[AuthGuard]},

  //ex28
  {path:'ex28',component: Ex28,canActivate:[AuthGuard]},

  //ex21 - Login Form
  {path:'ex21',component: Ex21,canActivate:[AuthGuard]},

  //ex22 - Course Registration
  {path:'ex22',component: Ex22,canActivate:[AuthGuard]},

  //ex39 - Book API Service
  {path:"ex39",component: Books,canActivate:[AuthGuard]},

  //ex41
  {path:"ex41",component: BookDetailComponent,canActivate:[AuthGuard]},
  {path:"ex41/:id",component: BookDetailComponent,canActivate:[AuthGuard]},

  //ex48-49 - File Upload
  {path:"upload",component: FileUploadComponent,canActivate:[AuthGuard]},

  //ex43
  {path:"ex43",component: NewBookComponent,canActivate:[AuthGuard]},

  //ex50 - Book Management CRUD
  {path:"ex50",component: BookManagementEx50,canActivate:[AuthGuard]},

  //ex45
  {path:"ex45/:id",component: BookUpdate,canActivate:[AuthGuard]},

  //ex53
  {path:"ex53",component: FashionComponent,canActivate:[AuthGuard]},

  //fashion-detail
  {path:"fashion-detail/:id",component: FashionDetailComponent,canActivate:[AuthGuard]},

  //MoMo Payment
  {path:"momo-payment",component: MomoPaymentComponent,canActivate:[AuthGuard]},
  {path:"momo-payment/result",component: MomoPaymentComponent,canActivate:[AuthGuard]},

  //Product List and Cart
  {path:"product-list",component: ProductListComponent,canActivate:[AuthGuard]},
  {path:"cart",component: CartComponent,canActivate:[AuthGuard]},

  
  {path:"**",component: Notfound}, //luôn để cuối cùng, mục đích để ngăn ai đó phá

  // { path: 'lunar', component: Ex10LunarYearComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
