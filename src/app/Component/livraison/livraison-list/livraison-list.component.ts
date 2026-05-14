import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Livraison } from '../../../model/livraison.model';
import { LivraisonService } from '../../../services/livraison.service';
import { AuthServiceService } from '../../../services/auth.service';

type LivraisonStatus = 'EN_ATTENTE' | 'EN_COURS' | 'EN_ROUTE' | 'LIVREE';

@Component({
  selector: 'app-livraison-list',
  templateUrl: './livraison-list.component.html',
  styleUrls: ['./livraison-list.component.css']
})
export class LivraisonListComponent implements OnInit {
  livraisons: Livraison[] = [];
  loading = false;
  errorMessage = '';

  statuses: LivraisonStatus[] = ['EN_ATTENTE', 'EN_COURS', 'EN_ROUTE', 'LIVREE'];

  constructor(
    private livraisonService: LivraisonService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLivraisons();
  }

  fetchLivraisons(): void {
    this.loading = true;
    this.errorMessage = '';
    this.livraisonService.getAllLivraisons().subscribe({
      next: (data) => {
        this.livraisons = data || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des livraisons.';
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/livraisons/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/livraisons/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cette livraison ?')) return;

    this.livraisonService.deleteLivraison(id).subscribe({
      next: () => {
        this.livraisons = this.livraisons.filter((l) => l.id_livraison !== id);
      },
      error: () => {
        this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
      }
    });
  }

  onStatusChange(id: number | undefined, status: LivraisonStatus): void {
    if (!id) return;
    this.livraisonService.updateStatus(id, status).subscribe({
      next: () => this.fetchLivraisons(),
      error: () => {
        this.errorMessage = 'Mise à jour du statut impossible.';
      }
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'LIVREE':
        return 'status delivered';
      case 'EN_ROUTE':
        return 'status transit';
      case 'EN_COURS':
        return 'status transit';
      default:
        return 'status pending';
    }
  }
}
