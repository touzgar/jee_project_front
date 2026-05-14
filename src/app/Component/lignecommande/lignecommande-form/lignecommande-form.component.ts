import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LigneCommandeService } from '../../../services/lignecommande.service';
import { CommandeService } from '../../../services/commande.service';
import { ProduitService } from '../../../services/produit.service';
import { Commande } from '../../../model/commande.model';
import { Produit } from '../../../model/produit.model';

@Component({
  selector: 'app-lignecommande-form',
  templateUrl: './lignecommande-form.component.html',
  styleUrls: ['./lignecommande-form.component.css']
})
export class LigneCommandeFormComponent implements OnInit {
  form!: FormGroup;
  commandes: Commande[] = [];
  produits: Produit[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private ligneService: LigneCommandeService,
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      quantite: [1, [Validators.required, Validators.min(1)]],
      prix_unitaire: [0, [Validators.required, Validators.min(0)]],
      commandeId: [null, Validators.required],
      produitId: [null, Validators.required]
    });

    this.loadCommandes();
    this.loadProduits();

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadLigne(this.id);
    }
  }

  loadCommandes(): void {
    this.commandeService.getAllCommandes().subscribe({
      next: (data) => (this.commandes = data || []),
      error: () => {}
    });
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data) => (this.produits = data || []),
      error: () => {}
    });
  }

  loadLigne(id: number): void {
    this.loading = true;
    this.ligneService.getLigneById(id).subscribe({
      next: (data: any) => {
        this.form.patchValue({
          quantite: data.quantite,
          prix_unitaire: data.prix_unitaire,
          commandeId: data.commande?.id_commande,
          produitId: data.produit?.id_produit || data.produitEntity?.id_produit
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la ligne.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: any = {
      quantite: this.form.value.quantite,
      prix_unitaire: this.form.value.prix_unitaire,
      commande: { id_commande: this.form.value.commandeId },
      produit: { id_produit: this.form.value.produitId }
    };

    this.loading = true;

    if (this.isEdit && this.id) {
      this.ligneService.updateLigne(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/lignecommandes']),
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.ligneService.createLigne(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/lignecommandes']),
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/lignecommandes']);
  }
}
