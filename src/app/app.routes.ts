import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component/home.component';
import { ProductDetailComponent } from './components/product-detail.component/product-detail.component';
import { CartComponent } from './components/cart.component/cart.component';
import { LoginComponent } from './components/login.component/login.component';
import { RegisterComponent } from './components/register.component/register.component';
import { AddProductComponent } from './components/add-product.component/add-product.component';
import { EditProductComponent } from './components/edit-product.component/edit-product.component';
import { ProfileComponent } from './components/profile.component/profile.component';
import { EditAddressComponent } from './components/saved-address.component/edit-address.component/edit-address.component';
import { SavedAddressComponent } from './components/saved-address.component/saved-address.component';
import { ManageAccountComponent } from './components/manage-account.component/manage-account.component';
import { CheckoutAddressComponent } from './components/address/checkout-address.component/checkout-address.component';
import { ConfirmOrderComponent } from './components/confirm-order.component/confirm-order.component'; import { authGuard } from './guards/auth.guard';


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
    },
    {
        path: 'manage-account',
        component: ManageAccountComponent,
        canActivate: [authGuard]
    },
    {
        path: 'checkout-address',
        component: CheckoutAddressComponent,
        canActivate: [authGuard]
    },

    {
        path: 'confirm-order',
        component: ConfirmOrderComponent,
        canActivate: [authGuard]
    },
    {
        path: 'saved-address',
        component: SavedAddressComponent,
        canActivate: [authGuard]
    },
    {
        path: 'edit-address/:id',
        component: EditAddressComponent,
        canActivate: [authGuard]
    },
];
