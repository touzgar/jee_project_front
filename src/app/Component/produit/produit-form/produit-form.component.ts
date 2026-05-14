import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../../services/produit.service';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../model/fournisseur.model';
import { Produit } from '../../../model/produit.model';

@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.css']
})
export class ProduitFormComponent implements OnInit {
  form!: FormGroup;
  fournisseurs: Fournisseur[] = [];
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom_produit: ['', Validators.required],
      description: ['', Validators.required],
      prix_unitaire: [0, [Validators.required, Validators.min(0)]],
      stock_actuel: [0, [Validators.required, Validators.min(0)]],
      stock_minimum: [0, [Validators.required, Validators.min(0)]],
      categorie: ['', Validators.required],
      fournisseurId: [null, Validators.required]
    });

    this.loadFournisseurs();

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      // Try to load from backend first, if fails, load from list
      this.loadProduitWithFallback(this.id);
    }
  }

  loadProduitWithFallback(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    
    // Load from list directly to avoid 404 errors
    this.produitService.getAllProduits().subscribe({
      next: (products) => {
        const product = products.find(p => p.id_produit === id);
        if (product) {
          this.populateForm(product);
        } else {
          this.errorMessage = 'Produit introuvable.';
          setTimeout(() => this.router.navigate(['/dashboard/produits']), 2000);
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le produit.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard/produits']), 2000);
      }
    });
  }
  populateForm(data: Produit): void {
    this.form.patchValue({
      nom_produit: data.nom_produit || '',
      description: data.description || '',
      prix_unitaire: data.prix_unitaire || 0,
      stock_actuel: data.stock_actuel || 0,
      stock_minimum: data.stock_minimum || 0,
      categorie: data.categorie || '',
      fournisseurId: data.fournisseur?.id_fournisseur || null
    });
  }

  loadFournisseurs(): void {
    this.fournisseurService.getAllFournisseurs().subscribe({
      next: (data) => (this.fournisseurs = data || []),
      error: () => {}
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Try different payload formats based on what backend expects
    const payload: any = {
      nom_produit: this.form.value.nom_produit,
      description: this.form.value.description,
      prix_unitaire: Number(this.form.value.prix_unitaire),
      stock_actuel: Number(this.form.value.stock_actuel),
      stock_minimum: Number(this.form.value.stock_minimum),
      categorie: this.form.value.categorie,
      // Try sending just the ID instead of nested object
      fournisseurId: this.form.value.fournisseurId
    };

    this.loading = true;
    this.errorMessage = '';

    if (this.isEdit && this.id) {
      payload.id_produit = this.id;
      this.produitService.updateProduit(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/produits']),
        error: (err) => {
          console.error('Update error:', err);
          this.errorMessage = err.error?.error || err.error?.message || 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.produitService.createProduit(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/produits']),
        error: (err) => {
          console.error('Create error:', err);
          this.errorMessage = err.error?.error || err.error?.message || 'Erreur lors de la création. Vérifiez que tous les champs sont corrects.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/produits']);
  }
}
