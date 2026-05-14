import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Commande } from '../../../model/commande.model';
import { CommandeService } from '../../../services/commande.service';
import { AuthServiceService } from '../../../services/auth.service';

type ValidationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'ALL';

@Component({
  selector: 'app-commande-list',
  templateUrl: './commande-list.component.html',
  styleUrls: ['./commande-list.component.css']
})
export class CommandeListComponent implements OnInit {
  commandes: Commande[] = [];
  filtered: Commande[] = [];
  loading = false;
  errorMessage = '';
  statusFilter: ValidationStatus = 'ALL';

  modalOpen = false;
  modalCommandeId?: number;
  modalAction: 'validate' | 'reject' = 'validate';
  validationComment = '';

  constructor(
    private commandeService: CommandeService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCommandes();
  }

  fetchCommandes(): void {
    this.loading = true;
    this.errorMessage = '';
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => {
        const all = data || [];
        const currentUser = this.authService.loggedUser;

        this.commandes = this.authService.isAdmin()
          ? all
          : all.filter((c) => c.user?.username === currentUser);

        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des commandes.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.statusFilter === 'ALL') {
      this.filtered = [...this.commandes];
    } else {
      this.filtered = this.commandes.filter((c) => c.validationStatus === this.statusFilter);
    }
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/commandes/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/commandes/edit', id]);
  }

  onView(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/commandes/view', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer cette commande ?')) return;

    this.commandeService.deleteCommande(id).subscribe({
      next: () => {
        this.commandes = this.commandes.filter((c) => c.id_commande !== id);
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
      }
    });
  }

  openModal(id: number | undefined, action: 'validate' | 'reject'): void {
    if (!id) return;
    this.modalCommandeId = id;
    this.modalAction = action;
    this.validationComment = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  submitValidation(): void {
    if (!this.modalCommandeId) return;
    const comment = this.validationComment || '';

    const request = this.modalAction === 'validate'
      ? this.commandeService.validateCommande(this.modalCommandeId, comment)
      : this.commandeService.rejectCommande(this.modalCommandeId, comment);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.fetchCommandes();
      },
      error: () => {
        this.errorMessage = 'Action impossible. Veuillez réessayer.';
      }
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'VALIDATED':
        return 'status validated';
      case 'REJECTED':
        return 'status rejected';
      default:
        return 'status pending';
    }
  }
}
