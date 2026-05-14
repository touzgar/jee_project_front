import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeService } from '../../../services/commande.service';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../model/produit.model';

@Component({
  selector: 'app-commande-form',
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.css']
})
export class CommandeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;
  produits: Produit[] = [];

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nomCommande: ['', Validators.required],
      date_commande: [new Date().toISOString().substring(0, 10), Validators.required],
      montant_commande: [{value: 0, disabled: true}],
      lignesCommande: this.fb.array([])
    });

    this.loadProduits();

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadCommandeWithFallback(this.id);
    } else {
      this.addLigne(); // Start with empty line if new order
    }

    // Automatically recalculate montant_commande when lines change
    this.form.get('lignesCommande')?.valueChanges.subscribe(lines => {
      let total = 0;
      lines.forEach((line: any) => {
        if (line.produitId && line.quantite) {
          const product = this.produits.find(p => p.id_produit == line.produitId);
          if (product) {
            total += (product.prix_unitaire * line.quantite);
          }
        }
      });
      this.form.patchValue({ montant_commande: total }, { emitEvent: false });
    });
  }

  get lignesCommande(): FormArray {
    return this.form.get('lignesCommande') as FormArray;
  }

  addLigne(): void {
    this.lignesCommande.push(this.fb.group({
      produitId: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeLigne(index: number): void {
    this.lignesCommande.removeAt(index);
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: () => this.errorMessage = 'Erreur lors du chargement des produits.'
    });
  }

  loadCommandeWithFallback(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.commandeService.getAllCommandes().subscribe({
      next: (commandes) => {
        const commande = commandes.find(c => c.id_commande === id);
        if (commande) {
          this.populateForm(commande);
        } else {
          this.errorMessage = 'Commande introuvable.';
          setTimeout(() => this.router.navigate(['/dashboard/commandes']), 2000);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la commande.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard/commandes']), 2000); 
      }
    });
  }

  populateForm(data: any): void {
    this.form.patchValue({
      nomCommande: data.nomCommande || '',
      date_commande: data.date_commande || new Date().toISOString().substring(0, 10),
      montant_commande: data.montant_commande || 0
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      nomCommande: this.form.value.nomCommande,
      date_commande: this.form.value.date_commande,
      montant_commande: this.form.getRawValue().montant_commande,
      lignesCommande: this.form.value.lignesCommande.map((l: any) => ({
        produit: { id_produit: Number(l.produitId) },
        quantite: l.quantite
      }))
    };

    this.loading = true;

    if (this.isEdit && this.id) {
      this.commandeService.updateCommande(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/commandes']),
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.commandeService.createCommande(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/commandes']),
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/commandes']);
  }
}
