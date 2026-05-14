import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../../../services/commande.service';
import { LigneCommandeService } from '../../../services/lignecommande.service';
import { LivraisonService } from '../../../services/livraison.service';
import { PaiementService } from '../../../services/paiement.service';
import { Commande } from '../../../model/commande.model';
import { LigneCommande } from '../../../model/ligneCommande.model';
import { Livraison } from '../../../model/livraison.model';
import { Paiement } from '../../../model/paiement.model';

@Component({
  selector: 'app-commande-detail',
  templateUrl: './commande-detail.component.html',
  styleUrls: ['./commande-detail.component.css']
})
export class CommandeDetailComponent implements OnInit {
  commande?: Commande;
  lignes: LigneCommande[] = [];
  livraisons: Livraison[] = [];
  paiements: Paiement[] = [];
  
  loading = false;
  errorMessage = '';
  commandeId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commandeService: CommandeService,
    private ligneService: LigneCommandeService,
    private livraisonService: LivraisonService,
    private paiementService: PaiementService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.commandeId = id;
      this.loadCommandeDetails(id);
    }
  }

  loadCommandeDetails(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    // Load from list directly to avoid 404 errors
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        this.commande = commandes.find(c => c.id_commande === id);
        if (!this.commande) {
          this.errorMessage = 'Commande introuvable.';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de la commande.';
        this.loading = false;
      }
    });

    // Load LigneCommandes
    this.ligneService.getLignesByCommande(id).subscribe({
      next: (data) => {
        this.lignes = data || [];
      },
      error: () => {
        console.error('Erreur lors du chargement des lignes de commande.');
      }
    });

    // Load Livraisons
    this.livraisonService.getByCommande(id).subscribe({
      next: (data) => {
        this.livraisons = data || [];
      },
      error: () => {
        console.error('Erreur lors du chargement des livraisons.');
      }
    });

    // Load Paiements
    this.paiementService.getByCommande(id).subscribe({
      next: (data) => {
        this.paiements = data || [];
      },
      error: () => {
        console.error('Erreur lors du chargement des paiements.');
      }
    });
  }

  calculateLineTotal(ligne: LigneCommande): number {
    return ligne.quantite * ligne.prix_unitaire;
  }

  calculateGrandTotal(): number {
    return this.lignes.reduce((sum, ligne) => sum + this.calculateLineTotal(ligne), 0);
  }

  getTotalLivraisons(): number {
    return this.livraisons.reduce((sum, liv) => sum + (liv.cout || 0), 0);
  }

  getTotalPaiements(): number {
    return 0;
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'EN_ATTENTE':
        return 'status-pending';
      case 'APPROVED':
      case 'VALIDATED':
      case 'VALIDEE':
        return 'status-approved';
      case 'REJECTED':
      case 'REJETEE':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'En attente';
      case 'APPROVED':
      case 'VALIDATED':
        return 'Validée';
      case 'REJECTED':
        return 'Rejetée';
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDEE':
        return 'Validée';
      case 'REJETEE':
        return 'Rejetée';
      default:
        return status;
    }
  }

  onBack(): void {
    this.router.navigate(['/dashboard/commandes']);
  }

  onEdit(): void {
    this.router.navigate(['/dashboard/commandes/edit', this.commandeId]);
  }

  onPrint(): void {
    window.print();
  }
}
