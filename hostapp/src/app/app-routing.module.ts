import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.service';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['account/dashboard']);
const routes: Routes = [
  {
    path: "", redirectTo: "login", pathMatch: "full",

  },
  {
    // ...canActivate(redirectLoggedInToHome)
    path: "login", ...canActivate(redirectLoggedInToHome), component: LoginComponent
  },
  {
    // ...canActivate(redirectUnauthorizedToLogin)
    path: 'account',...canActivate(redirectUnauthorizedToLogin)
  ,
    loadChildren: () =>
      import('../app/pages/account/account.module').then(m => m.AccountModule)

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponents=[
  LoginComponent
]