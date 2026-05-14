import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth.service';
import { CommandeService } from '../../services/commande.service';
import { LivraisonService } from '../../services/livraison.service';
import { FournisseurService } from '../../services/fournisseur.service';
import { ProduitService } from '../../services/produit.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  showAuthModal = false;
  isLoginMode = true;
  showLoginPassword = false;
  showRegisterPassword = false;
  
  loginUsername = '';
  loginPassword = '';
  registerUsername = '';
  registerEmail = '';
  registerPassword = '';
  
  errorMessage = '';
  loading = false;

  stats = {
    orders: 0,
    deliveries: 0,
    suppliers: 0,
    products: 0
  };

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private commandeService: CommandeService,
    private livraisonService: LivraisonService,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    if (this.authService.isloggedIn) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadRealStats();
  }

  loadRealStats(): void {
    forkJoin({
      commandes: this.commandeService.getAllCommandes(),
      livraisons: this.livraisonService.getAllLivraisons(),
      fournisseurs: this.fournisseurService.getAllFournisseurs(),
      produits: this.produitService.getAllProduits()
    }).subscribe({
      next: (data) => {
        const targetStats = {
          orders: data.commandes.length,
          deliveries: data.livraisons.length,
          suppliers: data.fournisseurs.length,
          products: data.produits.length
        };
        this.animateStatsToTarget(targetStats);
      },
      error: () => {
        const defaultStats = { orders: 0, deliveries: 0, suppliers: 0, products: 0 };
        this.stats = defaultStats;
      }
    });
  }

  animateStatsToTarget(targetStats: any): void {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      this.stats.orders = Math.floor(targetStats.orders * progress);
      this.stats.deliveries = Math.floor(targetStats.deliveries * progress);
      this.stats.suppliers = Math.floor(targetStats.suppliers * progress);
      this.stats.products = Math.floor(targetStats.products * progress);
      
      if (currentStep >= steps) {
        this.stats = { ...targetStats };
        clearInterval(timer);
      }
    }, interval);
  }

  openAuthModal(login: boolean = true): void {
    this.isLoginMode = login;
    this.showAuthModal = true;
    this.errorMessage = '';
    document.body.style.overflow = 'hidden';
  }

  closeAuthModal(): void {
    this.showAuthModal = false;
    this.errorMessage = '';
    this.loginUsername = '';
    this.loginPassword = '';
    this.registerUsername = '';
    this.registerEmail = '';
    this.registerPassword = '';
    document.body.style.overflow = '';
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleRegisterPassword(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  onLogin(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const user = {
      username: this.loginUsername,
      password: this.loginPassword
    };

    this.authService.login(user as any).subscribe({
      next: (response) => {
        const jwt = response.headers.get('Authorization');
        if (jwt) {
          this.authService.saveToken(jwt);
          this.loading = false;
          this.closeAuthModal();
          this.router.navigate(['/dashboard']);
        } else {
          this.loading = false;
          this.errorMessage = 'Erreur de connexion';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
    });
  }

  onRegister(): void {
    if (!this.registerUsername || !this.registerEmail || !this.registerPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }
    this.errorMessage = 'Inscription non disponible pour le moment. Veuillez contacter l\'administrateur.';
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
