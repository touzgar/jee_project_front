import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './Component/login/login.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { FournisseurListComponent } from './Component/fournisseur/fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './Component/fournisseur/fournisseur-form/fournisseur-form.component';
import { ProduitListComponent } from './Component/produit/produit-list/produit-list.component';
import { ProduitFormComponent } from './Component/produit/produit-form/produit-form.component';
import { ProduitLowStockComponent } from './Component/produit/produit-low-stock/produit-low-stock.component';
import { CommandeListComponent } from './Component/commande/commande-list/commande-list.component';
import { CommandeFormComponent } from './Component/commande/commande-form/commande-form.component';
import { TransporteurListComponent } from './Component/transporteur/transporteur-list/transporteur-list.component';
import { TransporteurFormComponent } from './Component/transporteur/transporteur-form/transporteur-form.component';
import { LivraisonListComponent } from './Component/livraison/livraison-list/livraison-list.component';
import { LivraisonFormComponent } from './Component/livraison/livraison-form/livraison-form.component';
import { PaiementListComponent } from './Component/paiement/paiement-list/paiement-list.component';
import { PaiementFormComponent } from './Component/paiement/paiement-form/paiement-form.component';
import { LigneCommandeListComponent } from './Component/lignecommande/lignecommande-list/lignecommande-list.component';
import { LigneCommandeFormComponent } from './Component/lignecommande/lignecommande-form/lignecommande-form.component';
import { UserListComponent } from './Component/user/user-list/user-list.component';
import { UserFormComponent } from './Component/user/user-form/user-form.component';
import { DashboardHomeComponent } from './Component/dashboard/dashboard-home/dashboard-home.component';
import { CommandeDetailComponent } from './Component/commande/commande-detail/commande-detail.component';
import { OrderCheckoutComponent } from './Component/commande/order-checkout/order-checkout.component';
import { LandingComponent } from './Component/landing/landing.component';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    DashboardHomeComponent,
    FournisseurListComponent,
    FournisseurFormComponent,
    ProduitListComponent,
    ProduitFormComponent,
    ProduitLowStockComponent,
    CommandeListComponent,
    CommandeFormComponent,
    TransporteurListComponent,
    TransporteurFormComponent,
    LivraisonListComponent,
    LivraisonFormComponent,
    PaiementListComponent,
    PaiementFormComponent,
    LigneCommandeListComponent,
    LigneCommandeFormComponent,
    UserListComponent,
    UserFormComponent,
    CommandeDetailComponent,
    OrderCheckoutComponent,
    LandingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:8090'],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
