import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produit } from '../../../model/produit.model';
import { Commande } from '../../../model/commande.model';
import { LigneCommande } from '../../../model/ligneCommande.model';
import { Paiement } from '../../../model/paiement.model';
import { ProduitService } from '../../../services/produit.service';
import { CommandeService } from '../../../services/commande.service';
import { LigneCommandeService } from '../../../services/lignecommande.service';
import { PaiementService } from '../../../services/paiement.service';
import { AuthServiceService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';

interface CartItem {
  produit: Produit;
  quantity: number;
  subtotal: number;
}

@Component({
  selector: 'app-order-checkout',
  templateUrl: './order-checkout.component.html',
  styleUrls: ['./order-checkout.component.css']
})
export class OrderCheckoutComponent implements OnInit {
  // Product selection
  availableProducts: Produit[] = [];
  filteredProducts: Produit[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  categories: string[] = [];

  // Shopping cart
  cart: CartItem[] = [];
  totalAmount: number = 0;

  // Order details
  orderName: string = '';
  orderComment: string = '';

  // Payment details
  paymentMode: string = 'CASH';
  paymentModes: string[] = ['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHECK', 'MOBILE_PAYMENT'];

  // UI states
  isLoading: boolean = false;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  showProductSelector: boolean = true;

  constructor(
    private produitService: ProduitService,
    private commandeService: CommandeService,
    private ligneCommandeService: LigneCommandeService,
    private paiementService: PaiementService,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.produitService.getAllProduits().subscribe({
      next: (products) => {
        this.availableProducts = products.filter(p => p.stock_actuel > 0);
        this.filteredProducts = [...this.availableProducts];
        this.extractCategories();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.errorMessage = 'Failed to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set(this.availableProducts.map(p => p.categorie));
    this.categories = Array.from(categorySet).sort();
  }

  filterProducts(): void {
    this.filteredProducts = this.availableProducts.filter(product => {
      const matchesSearch = product.nom_produit.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || product.categorie === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  addToCart(produit: Produit): void {
    const existingItem = this.cart.find(item => item.produit.id_produit === produit.id_produit);
    
    if (existingItem) {
      if (existingItem.quantity < produit.stock_actuel) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.produit.prix_unitaire;
      } else {
        this.errorMessage = `Maximum stock available: ${produit.stock_actuel}`;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    } else {
      this.cart.push({
        produit: produit,
        quantity: 1,
        subtotal: produit.prix_unitaire
      });
    }
    
    this.calculateTotal();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(item);
      return;
    }

    if (quantity > item.produit.stock_actuel) {
      this.errorMessage = `Maximum stock available: ${item.produit.stock_actuel}`;
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    item.quantity = quantity;
    item.subtotal = item.quantity * item.produit.prix_unitaire;
    this.calculateTotal();
  }

  removeFromCart(item: CartItem): void {
    const index = this.cart.indexOf(item);
    if (index > -1) {
      this.cart.splice(index, 1);
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getTotalQuantity(): number {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart(): void {
    this.cart = [];
    this.totalAmount = 0;
  }

  isProductInCart(produit: Produit): boolean {
    return this.cart.some(item => item.produit.id_produit === produit.id_produit);
  }

  getCartQuantity(produit: Produit): number {
    const item = this.cart.find(item => item.produit.id_produit === produit.id_produit);
    return item ? item.quantity : 0;
  }

  validateOrder(): boolean {
    this.errorMessage = '';

    if (this.cart.length === 0) {
      this.errorMessage = 'Please add at least one product to your cart.';
      return false;
    }

    if (!this.orderName || this.orderName.trim() === '') {
      this.errorMessage = 'Please enter an order name.';
      return false;
    }

    if (!this.paymentMode) {
      this.errorMessage = 'Please select a payment method.';
      return false;
    }

    return true;
  }

  placeOrder(): void {
    if (!this.validateOrder()) {
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    // Step 1: Create the order
    const newCommande: Partial<Commande> = {
      nomCommande: this.orderName,
      date_commande: new Date(),
      status_commande: true,
      montant_commande: this.totalAmount,
      validationStatus: 'PENDING'
    };

    this.commandeService.createCommande(newCommande).subscribe({
      next: (createdCommande) => {
        // Step 2: Create all line items for the order
        this.createOrderLines(createdCommande);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.errorMessage = 'Failed to create order. Please try again.';
        this.isProcessing = false;
      }
    });
  }

  private createOrderLines(commande: Commande): void {
    const lineCreationObservables = this.cart.map(item => {
      const ligne: Partial<LigneCommande> = {
        produit: item.produit.nom_produit,
        quantite: item.quantity,
        prix_unitaire: item.produit.prix_unitaire,
        commande: commande,
        produitEntity: item.produit
      };
      return this.ligneCommandeService.createLigne(ligne);
    });

    // Create all line items in parallel
    forkJoin(lineCreationObservables).subscribe({
      next: (createdLines) => {
        console.log('Order lines created:', createdLines);
        // Step 3: Create payment
        this.createPayment(commande);
      },
      error: (error) => {
        console.error('Error creating order lines:', error);
        this.errorMessage = 'Order created but failed to add products. Please contact support.';
        this.isProcessing = false;
      }
    });
  }

  private createPayment(commande: Commande): void {
    const newPaiement: Partial<Paiement> = {
      date_paiement: new Date(),
      statut: 'PENDING',
      mode: this.paymentMode,
      commande: commande
    };

    this.paiementService.createPaiement(newPaiement).subscribe({
      next: (createdPaiement) => {
        console.log('Payment created:', createdPaiement);
        this.isProcessing = false;
        this.successMessage = `Order #${commande.id_commande} placed successfully! Total: ${this.totalAmount.toFixed(2)} MAD`;
        
        // Clear the cart and reset form
        this.clearCart();
        this.orderName = '';
        this.orderComment = '';
        this.paymentMode = 'CASH';
        
        // Redirect to order details after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/commande/detail', commande.id_commande]);
        }, 2000);
      },
      error: (error) => {
        console.error('Error creating payment:', error);
        this.errorMessage = 'Order created but payment failed. Please contact support.';
        this.isProcessing = false;
      }
    });
  }

  toggleProductSelector(): void {
    this.showProductSelector = !this.showProductSelector;
  }
}
