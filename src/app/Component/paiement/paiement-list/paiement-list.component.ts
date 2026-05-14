import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Paiement } from '../../../model/paiement.model';
import { PaiementService } from '../../../services/paiement.service';
import { AuthServiceService } from '../../../services/auth.service';

@Component({
  selector: 'app-paiement-list',
  templateUrl: './paiement-list.component.html',
  styleUrls: ['./paiement-list.component.css']
})
export class PaiementListComponent implements OnInit {
  paiements: Paiement[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private paiementService: PaiementService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchPaiements();
  }

  fetchPaiements(): void {
    this.loading = true;
    this.errorMessage = '';
    this.paiementService.getAllPaiements().subscribe({
      next: (data) => {
        this.paiements = data || [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des paiements.';
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/paiements/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/paiements/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer ce paiement ?')) return;

    this.paiementService.deletePaiement(id).subscribe({
      next: () => {
        this.paiements = this.paiements.filter((p) => p.id_paiement !== id);
      },
      error: () => {
        this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
      }
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status completed';
      case 'Failed':
        return 'status failed';
      default:
        return 'status pending';
    }
  }
}
