import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { ProductDetailComponent } from './components/product-detail.component/product-detail.component';
import { CartComponent } from './components/cart.component/cart.component';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { AddProductComponent } from './components/add-product.component/add-product.component';
import { EditProductComponent } from './components/edit-product.component/edit-product.component';
import { ProfileComponent } from './components/profile.component/profile.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'product/:id', component: ProductDetailComponent },
    {
        path: 'cart',
        component: CartComponent,
        canActivate: [authGuard]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    {
        path: 'addProduct',
        component: AddProductComponent,
        canActivate: [authGuard]
    },
    {
        path: 'editProduct/:id',
        component: EditProductComponent
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    }
];
