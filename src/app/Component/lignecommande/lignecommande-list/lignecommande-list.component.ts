import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LigneCommande } from '../../../model/ligneCommande.model';
import { LigneCommandeService } from '../../../services/lignecommande.service';
import { AuthServiceService } from '../../../services/auth.service';

@Component({
  selector: 'app-lignecommande-list',
  templateUrl: './lignecommande-list.component.html',
  styleUrls: ['./lignecommande-list.component.css']
})
export class LigneCommandeListComponent implements OnInit {
  lignes: LigneCommande[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private ligneService: LigneCommandeService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLignes();
  }

  fetchLignes(): void {
    this.loading = true;
    this.errorMessage = '';
    this.ligneService.getAllLignes().subscribe({
      next: (data) => {
        this.lignes = data || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des lignes de commande.';
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/lignecommandes/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/lignecommandes/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cette ligne ?')) return;

    this.ligneService.deleteLigne(id).subscribe({
      next: () => {
        this.lignes = this.lignes.filter((l) => l.id_ligne !== id);
      },
      error: () => {
        this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
      }
    });
  }

  total(l: LigneCommande): number {
    return (l.quantite || 0) * (l.prix_unitaire || 0);
  }

  produitName(l: LigneCommande): string {
    return l.produitEntity?.nom_produit || (l as any).produit?.nom_produit || '';
  }
}
