import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LivraisonService } from '../../../services/livraison.service';
import { CommandeService } from '../../../services/commande.service';
import { TransporteurService } from '../../../services/transporteur.service';
import { Commande } from '../../../model/commande.model';
import { Transporteur } from '../../../model/transporteur.model';

@Component({
  selector: 'app-livraison-form',
  templateUrl: './livraison-form.component.html',
  styleUrls: ['./livraison-form.component.css']
})
export class LivraisonFormComponent implements OnInit {
  form!: FormGroup;
  commandes: Commande[] = [];
  transporteurs: Transporteur[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  statuses = ['EN_ATTENTE', 'EN_COURS', 'EN_ROUTE', 'LIVREE'];

  constructor(
    private fb: FormBuilder,
    private livraisonService: LivraisonService,
    private commandeService: CommandeService,
    private transporteurService: TransporteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date_livraison: ['', Validators.required],
      cout: [0, [Validators.required, Validators.min(0)]],
      statut: ['EN_ATTENTE', Validators.required],
      commandeId: [null, Validators.required],
      transporteurId: [null, Validators.required]
    });

    this.loadCommandes();
    this.loadTransporteurs();

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadLivraison(this.id);
    }
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => (this.commandes = data || []),
      error: () => {}
    });
  }

  loadTransporteurs(): void {
    this.transporteurService.getAllTransporteurs().subscribe({
      next: (data) => (this.transporteurs = data || []),
      error: () => {}
    });
  }

  loadLivraison(id: number): void {
    this.loading = true;
    this.livraisonService.getLivraisonById(id).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          date_livraison: data.date_livraison ? data.date_livraison.toString().substring(0, 10) : '',
          cout: data.cout ?? 0,
          statut: data.statut,
          commandeId: data.commande?.id_commande,
          transporteurId: data.transporteur?.id_transporteur
        });
        this.loading = false;
      },
      error: () => {
        this.livraisonService.getAllLivraisons().subscribe({
          next: (livraisons) => {
            const item = (livraisons || []).find((l) => l.id_livraison === id);
            if (item) {
              this.form.patchValue({
                date_livraison: item.date_livraison ? item.date_livraison.toString().substring(0, 10) : '',
                cout: item.cout ?? 0,
                statut: item.statut,
                commandeId: item.commande?.id_commande,
                transporteurId: item.transporteur?.id_transporteur
              });
            } else {
              this.errorMessage = 'Livraison introuvable.';
            }
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur.';
            this.loading = false;
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      date_livraison: this.form.value.date_livraison,
      cout: this.form.value.cout,
      statut: this.form.value.statut,
      commande: { id_commande: this.form.value.commandeId },
      transporteur: { id_transporteur: this.form.value.transporteurId },
      commandeId: this.form.value.commandeId,
      transporteurId: this.form.value.transporteurId
    };

    this.loading = true;

    if (this.isEdit && this.id) {
      this.livraisonService.updateLivraison(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/livraisons']),
        error: (err) => { console.error(err); this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur.'; this.loading = false; }
      });
    } else {
      this.livraisonService.createLivraison(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/livraisons']),
        error: (err) => { console.error(err); this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur.'; this.loading = false; }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/livraisons']);
  }
}
