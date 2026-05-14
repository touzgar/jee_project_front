import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../../services/fournisseur.service';
import { Fournisseur } from '../../../model/fournisseur.model';

@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.css']
})
export class FournisseurFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom_fournisseur: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      pays: ['', Validators.required]
    });

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadFournisseur(this.id);
    }
  }

  loadFournisseur(id: number): void {
    this.loading = true;
    this.fournisseurService.getFournisseurById(id).subscribe({
      next: (data) => {
        this.form.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données du fournisseur.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Fournisseur = this.form.value;
    this.loading = true;

    if (this.isEdit && this.id) {
      this.fournisseurService.updateFournisseur(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/fournisseurs']),
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.fournisseurService.createFournisseur(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/fournisseurs']),
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/fournisseurs']);
  }
}
