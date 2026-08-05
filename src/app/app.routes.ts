import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { ProductDetailComponent } from './components/product-detail.component/product-detail.component';
import { CartComponent } from './components/cart.component/cart.component';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { AddProductComponent } from './components/add-product.component/add-product.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'addProduct', component: AddProductComponent }
];
