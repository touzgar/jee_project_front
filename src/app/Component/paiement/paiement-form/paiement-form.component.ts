import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiementService } from '../../../services/paiement.service';
import { CommandeService } from '../../../services/commande.service';
import { Commande } from '../../../model/commande.model';

@Component({
  selector: 'app-paiement-form',
  templateUrl: './paiement-form.component.html',
  styleUrls: ['./paiement-form.component.css']
})
export class PaiementFormComponent implements OnInit {
  form!: FormGroup;
  commandes: Commande[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  modes = ['Cash', 'Credit Card', 'Bank Transfer'];
  statuses = ['Pending', 'Completed', 'Failed'];

  constructor(
    private fb: FormBuilder,
    private paiementService: PaiementService,
    private commandeService: CommandeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      date_paiement: ['', Validators.required],
      mode: ['Cash', Validators.required],
      statut: ['Pending', Validators.required],
      commandeId: [null, Validators.required]
    });

    this.loadCommandes();

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadPaiement(this.id);
    }
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => (this.commandes = data || []),
      error: () => {}
    });
  }

  loadPaiement(id: number): void {
    this.loading = true;
    this.paiementService.getPaiementById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          date_paiement: data.date_paiement ? data.date_paiement.toString().substring(0, 10) : '',
          mode: data.mode,
          statut: data.statut,
          commandeId: data.commande?.id_commande
        });
        this.loading = false;
      },
      error: () => {
        this.paiementService.getAllPaiements().subscribe({
          next: (paiements) => {
            const item = (paiements || []).find((p) => p.id_paiement === id);
            if (item) {
              this.form.patchValue({
                date_paiement: item.date_paiement ? item.date_paiement.toString().substring(0, 10) : '',
                mode: item.mode,
                statut: item.statut,
                commandeId: item.commande?.id_commande
              });
            } else {
              this.errorMessage = 'Paiement introuvable.';
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
      date_paiement: this.form.value.date_paiement,
      mode: this.form.value.mode,
      statut: this.form.value.statut,
      commande: { id_commande: this.form.value.commandeId },
      commandeId: this.form.value.commandeId
    };

    this.loading = true;

    if (this.isEdit && this.id) {
      this.paiementService.updatePaiement(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/paiements']),
        error: (err) => { console.error(err); this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur.'; this.loading = false; }
      });
    } else {
      this.paiementService.createPaiement(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/paiements']),
        error: (err) => { console.error(err); this.errorMessage = err.error?.error || err.error?.message || 'Erreur serveur.'; this.loading = false; }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/paiements']);
  }
}
