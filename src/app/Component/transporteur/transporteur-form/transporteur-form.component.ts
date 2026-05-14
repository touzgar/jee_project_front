import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransporteurService } from '../../../services/transporteur.service';

@Component({
  selector: 'app-transporteur-form',
  templateUrl: './transporteur-form.component.html',
  styleUrls: ['./transporteur-form.component.css']
})
export class TransporteurFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  errorMessage = '';
  id?: number;

  constructor(
    private fb: FormBuilder,
    private transporteurService: TransporteurService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nom_transporteur: ['', Validators.required],
      telephone: ['', Validators.required],
      note: ['', Validators.required]
    });

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadTransporteur(this.id);
    }
  }

  loadTransporteur(id: number): void {
    this.loading = true;
    this.transporteurService.getTransporteurById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          nom_transporteur: data.nom_transporteur,
          telephone: data.telephone,
          note: data.note
        });
        this.loading = false;
      },
      error: () => {
        this.transporteurService.getAllTransporteurs().subscribe({
          next: (transporteurs) => {
            const item = (transporteurs || []).find((t) => t.id_transporteur === id);
            if (item) {
              this.form.patchValue({
                nom_transporteur: item.nom_transporteur,
                telephone: item.telephone,
                note: item.note
              });
            } else {
              this.errorMessage = 'Transporteur introuvable.';
            }
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'Impossible de charger le transporteur.';
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

    const payload = this.form.value;
    this.loading = true;

    if (this.isEdit && this.id) {
      this.transporteurService.updateTransporteur(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/transporteurs']),
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      this.transporteurService.createTransporteur(payload).subscribe({
        next: () => this.router.navigate(['/dashboard/transporteurs']),
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/transporteurs']);
  }
}
