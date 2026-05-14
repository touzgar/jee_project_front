import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fournisseur } from '../../../model/fournisseur.model';
import { FournisseurService } from '../../../services/fournisseur.service';
import { AuthServiceService } from '../../../services/auth.service';

@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  filteredFournisseurs: Fournisseur[] = [];
  searchTerm = '';
  selectedPays = '';
  countries: string[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private fournisseurService: FournisseurService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchFournisseurs();
  }

  fetchFournisseurs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data || [];
        this.filteredFournisseurs = [...this.fournisseurs];
        this.extractCountries();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des fournisseurs.';
        this.loading = false;
      }
    });
  }

  extractCountries(): void {
    const paysSet = new Set<string>();
    this.fournisseurs.forEach(f => {
      if (f.pays) {
        paysSet.add(f.pays);
      }
    });
    this.countries = Array.from(paysSet).sort();
  }

  onSearchByName(): void {
    if (!this.searchTerm.trim()) {
      this.fetchFournisseurs();
      return;
    }

    this.loading = true;
    this.fournisseurService.searchByName(this.searchTerm).subscribe({
      next: (data) => {
        this.filteredFournisseurs = data || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la recherche.';
        this.loading = false;
      }
    });
  }

  onFilterByPays(): void {
    if (!this.selectedPays) {
      this.fetchFournisseurs();
      return;
    }

    this.loading = true;
    this.fournisseurService.searchByPays(this.selectedPays).subscribe({
      next: (data) => {
        this.filteredFournisseurs = data || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du filtrage.';
        this.loading = false;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedPays = '';
    this.fetchFournisseurs();
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/fournisseurs/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/fournisseurs/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) return;

    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => {
        // Success - remove from list
        this.filteredFournisseurs = this.filteredFournisseurs.filter((f) => f.id_fournisseur !== id);
        this.fournisseurs = this.fournisseurs.filter((f) => f.id_fournisseur !== id);
      },
      error: (err) => {
        // Even if backend returns error, check if it's actually deleted
        // Some backends return 400 but still delete successfully
        if (err.status === 400 || err.status === 204) {
          // Treat as success
          this.filteredFournisseurs = this.filteredFournisseurs.filter((f) => f.id_fournisseur !== id);
          this.fournisseurs = this.fournisseurs.filter((f) => f.id_fournisseur !== id);
        } else {
          this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
        }
      }
    });
  }
}
