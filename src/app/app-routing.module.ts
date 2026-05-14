import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './Component/login/login.component';
import { DashboardComponent } from './Component/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin.guard';
import { FournisseurListComponent } from './Component/fournisseur/fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './Component/fournisseur/fournisseur-form/fournisseur-form.component';
import { ProduitListComponent } from './Component/produit/produit-list/produit-list.component';
import { ProduitFormComponent } from './Component/produit/produit-form/produit-form.component';
import { ProduitLowStockComponent } from './Component/produit/produit-low-stock/produit-low-stock.component';
import { CommandeListComponent } from './Component/commande/commande-list/commande-list.component';
import { CommandeFormComponent } from './Component/commande/commande-form/commande-form.component';
import { CommandeDetailComponent } from './Component/commande/commande-detail/commande-detail.component';
import { OrderCheckoutComponent } from './Component/commande/order-checkout/order-checkout.component';
import { LandingComponent } from './Component/landing/landing.component';
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

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard Home
      { path: '', component: DashboardHomeComponent },
      
      // Fournisseur Routes
      { path: 'fournisseurs', component: FournisseurListComponent },
      { path: 'fournisseurs/create', component: FournisseurFormComponent, canActivate: [AdminGuard] },
      { path: 'fournisseurs/edit/:id', component: FournisseurFormComponent, canActivate: [AdminGuard] },
      
      // Produit Routes
      { path: 'produits', component: ProduitListComponent },
      { path: 'produits/create', component: ProduitFormComponent, canActivate: [AdminGuard] },
      { path: 'produits/edit/:id', component: ProduitFormComponent, canActivate: [AdminGuard] },
      { path: 'produits/low-stock', component: ProduitLowStockComponent },
      
      // Commande Routes
      { path: 'commandes', component: CommandeListComponent },
      { path: 'commandes/create', component: CommandeFormComponent },
      { path: 'commandes/checkout', component: OrderCheckoutComponent },
      { path: 'commandes/edit/:id', component: CommandeFormComponent },
      { path: 'commandes/view/:id', component: CommandeDetailComponent },
      
      // Transporteur Routes
      { path: 'transporteurs', component: TransporteurListComponent },
      { path: 'transporteurs/create', component: TransporteurFormComponent, canActivate: [AdminGuard] },
      { path: 'transporteurs/edit/:id', component: TransporteurFormComponent, canActivate: [AdminGuard] },
      
      // Livraison Routes
      { path: 'livraisons', component: LivraisonListComponent },
      { path: 'livraisons/create', component: LivraisonFormComponent, canActivate: [AdminGuard] },
      { path: 'livraisons/edit/:id', component: LivraisonFormComponent, canActivate: [AdminGuard] },
      
      // Paiement Routes
      { path: 'paiements', component: PaiementListComponent },
      { path: 'paiements/create', component: PaiementFormComponent },
      { path: 'paiements/edit/:id', component: PaiementFormComponent, canActivate: [AdminGuard] },
      
      // LigneCommande Routes
      { path: 'lignecommandes', component: LigneCommandeListComponent },
      { path: 'lignecommandes/create', component: LigneCommandeFormComponent },
      { path: 'lignecommandes/edit/:id', component: LigneCommandeFormComponent },
      
      // User Management Routes (ADMIN only)
      { path: 'users', component: UserListComponent, canActivate: [AdminGuard] },
      { path: 'users/create', component: UserFormComponent, canActivate: [AdminGuard] },
      { path: 'users/edit/:id', component: UserFormComponent, canActivate: [AdminGuard] }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
