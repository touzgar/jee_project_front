import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Transporteur } from '../../../model/transporteur.model';
import { TransporteurService } from '../../../services/transporteur.service';
import { AuthServiceService } from '../../../services/auth.service';

@Component({
  selector: 'app-transporteur-list',
  templateUrl: './transporteur-list.component.html',
  styleUrls: ['./transporteur-list.component.css']
})
export class TransporteurListComponent implements OnInit {
  transporteurs: Transporteur[] = [];
  filtered: Transporteur[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(
    private transporteurService: TransporteurService,
    public authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchTransporteurs();
  }

  fetchTransporteurs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => {
        this.transporteurs = data || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des transporteurs.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filtered = [...this.transporteurs];
      return;
    }

    this.filtered = this.transporteurs.filter((t) => {
      return [
        t.nom_transporteur,
        t.telephone,
        t.note
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(term));
    });
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/transporteurs/create']);
  }

  onEdit(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/dashboard/transporteurs/edit', id]);
  }

  onDelete(id: number | undefined): void {
    if (!id) return;
    if (!confirm('Voulez-vous vraiment supprimer ce transporteur ?')) return;

    this.transporteurService.deleteTransporteur(id).subscribe({
      next: () => {
        this.transporteurs = this.transporteurs.filter((t) => t.id_transporteur !== id);
        this.applyFilter();
      },
      error: () => {
        this.errorMessage = 'Suppression impossible. Veuillez réessayer.';
      }
    });
  }
}
