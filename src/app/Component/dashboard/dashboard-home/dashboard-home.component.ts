import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommandeService } from '../../../services/commande.service';
import { ProduitService } from '../../../services/produit.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { LivraisonService } from '../../../services/livraison.service';
import { Commande } from '../../../model/commande.model';
import { Produit } from '../../../model/produit.model';
import { Livraison } from '../../../model/livraison.model';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit, AfterViewInit {
  @ViewChild('commandesChart') commandesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('livraisonsChart') livraisonsChartRef!: ElementRef<HTMLCanvasElement>;

  // Statistics
  totalCommandes = 0;
  pendingCommandes = 0;
  approvedCommandes = 0;
  rejectedCommandes = 0;
  totalProduits = 0;
  lowStockCount = 0;
  totalFournisseurs = 0;
  totalLivraisons = 0;
  pendingLivraisons = 0;
  deliveredLivraisons = 0;

  // Data lists
  recentCommandes: Commande[] = [];
  lowStockProducts: Produit[] = [];
  allCommandes: Commande[] = [];
  allLivraisons: Livraison[] = [];

  // Charts
  commandesChart?: Chart;
  livraisonsChart?: Chart;

  loading = false;

  constructor(
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private livraisonService: LivraisonService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Charts will be created after data is loaded
  }

  loadStats(): void {
    this.loading = true;

    // Load Commandes
    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        this.allCommandes = commandes || [];
        this.totalCommandes = this.allCommandes.length;
        this.pendingCommandes = this.allCommandes.filter(c => c.validationStatus === 'PENDING').length;
        this.approvedCommandes = this.allCommandes.filter(c => c.validationStatus === 'APPROVED').length;
        this.rejectedCommandes = this.allCommandes.filter(c => c.validationStatus === 'REJECTED').length;
        
        this.recentCommandes = [...this.allCommandes]
          .sort((a, b) => new Date(b.date_commande as any).getTime() - new Date(a.date_commande as any).getTime())
          .slice(0, 5);
        
        this.createCommandesChart();
      },
      error: () => {}
    });

    // Load Produits
    this.produitService.getAllProduits().subscribe({
      next: (produits) => {
        this.totalProduits = (produits || []).length;
      },
      error: () => {}
    });

    // Load Low Stock Products
    this.produitService.getLowStockProducts().subscribe({
      next: (low) => {
        this.lowStockProducts = low || [];
        this.lowStockCount = this.lowStockProducts.length;
      },
      error: () => {}
    });

    // Load Fournisseurs
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (fournisseurs) => {
        this.totalFournisseurs = (fournisseurs || []).length;
      },
      error: () => {}
    });

    // Load Livraisons
    this.livraisonService.getAllLivraisons().subscribe({
      next: (livraisons) => {
        this.allLivraisons = livraisons || [];
        this.totalLivraisons = this.allLivraisons.length;
        
        // Count by status
        this.pendingLivraisons = this.allLivraisons.filter(l =>
          l.statut === 'EN_ATTENTE' || l.statut === 'PENDING'
        ).length;
        this.deliveredLivraisons = this.allLivraisons.filter(l =>
          l.statut === 'LIVREE' || l.statut === 'DELIVERED'
        ).length;
        
        this.loading = false;
        this.createLivraisonsChart();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  createCommandesChart(): void {
    if (!this.commandesChartRef) {
      setTimeout(() => this.createCommandesChart(), 100);
      return;
    }

    const ctx = this.commandesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if any
    if (this.commandesChart) {
      this.commandesChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['En attente', 'Approuvées', 'Rejetées'],
        datasets: [{
          data: [this.pendingCommandes, this.approvedCommandes, this.rejectedCommandes],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',  // Orange
            'rgba(34, 197, 94, 0.8)',   // Green
            'rgba(239, 68, 68, 0.8)'    // Red
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          title: {
            display: true,
            text: 'Commandes par statut',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        }
      }
    };

    this.commandesChart = new Chart(ctx, config);
  }

  createLivraisonsChart(): void {
    if (!this.livraisonsChartRef) {
      setTimeout(() => this.createLivraisonsChart(), 100);
      return;
    }

    const ctx = this.livraisonsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if any
    if (this.livraisonsChart) {
      this.livraisonsChart.destroy();
    }

    // Count livraisons by different statuses
    const enCours = this.allLivraisons.filter(l =>
      l.statut === 'EN_COURS'
    ).length;
    const enRoute = this.allLivraisons.filter(l =>
      l.statut === 'EN_ROUTE'
    ).length;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['En attente', 'En cours', 'En route', 'Livrées'],
        datasets: [{
          label: 'Nombre de livraisons',
          data: [this.pendingLivraisons, enCours, enRoute, this.deliveredLivraisons],
          backgroundColor: [
            'rgba(245, 158, 11, 0.7)',  // Orange
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(168, 85, 247, 0.7)',  // Purple
            'rgba(34, 197, 94, 0.7)'    // Green
          ],
          borderColor: [
            'rgba(245, 158, 11, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(168, 85, 247, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Livraisons par statut',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.livraisonsChart = new Chart(ctx, config);
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
      case 'EN_ATTENTE':
        return 'badge-warning';
      case 'APPROVED':
      case 'VALIDEE':
        return 'badge-success';
      case 'REJECTED':
      case 'REJETEE':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'En attente';
      case 'APPROVED':
        return 'Approuvée';
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
}
