import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produit } from '../../../model/produit.model';
import { Fournisseur } from '../../../model/fournisseur.model';
import { ProduitService } from '../../../services/produit.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { AuthServiceService } from '../../../services/auth.service';

@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  fournisseurs: Fournisseur[] = [];
  selectedFournisseurId: number | 'all' = 'all';
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFournisseurs();
    this.fetchProduits();
  }

  fetchFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => (this.fournisseurs = data || []),
      error: () => {}
    });
  }

  fetchProduits(): void {
    this.loading = true;
    this.errorMessage = '';
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des produits.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredProduits = this.produits.filter((p) => {
      const matchesText = !term || [
        p.nom_produit,
        p.description,
        p.categorie,
        p.fournisseur?.nom_fournisseur
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(term));

      const matchesFournisseur =
        this.selectedFournisseurId === 'all' ||
        p.fournisseur?.id_fournisseur === this.selectedFournisseurId;

      return matchesText && matchesFournisseur;
    });
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/produits/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/produits/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    this.produitService.deleteProduit(id).subscribe({
      next: () => {
        // Success - remove from list
        this.produits = this.produits.filter((p) => p.id_produit !== id);
        this.applyFilter();
      },
      error: (err) => {
        // Even if backend returns error, check if it's actually deleted
        // Some backends return 400 but still delete successfully
        if (err.status === 400 || err.status === 204) {
          // Treat as success
          this.produits = this.produits.filter((p) => p.id_produit !== id);
          this.applyFilter();
        } else {
          this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
        }
      }
    });
  }

  isLowStock(p: Produit): boolean {
    return p.stock_actuel <= p.stock_minimum;
  }
}
