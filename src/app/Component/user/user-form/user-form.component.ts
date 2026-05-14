import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMessage = '';
  isEdit = false;
  id?: number;

  roles = ['ADMIN', 'USER'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: [''],
      email: ['', Validators.required],
      address: [''],
      enabled: [true],
      roles: [[], Validators.required]
    });

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdit = true;
      this.id = Number(paramId);
      this.loadUser(this.id);
    } else {
      this.form.get('password')?.setValidators([Validators.required]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const user = (users || []).find((u) => u.userId === id);
        if (user) {
          this.form.patchValue({
            username: user.username,
            email: user.email,
            address: user.address,
            enabled: user.enabled,
            roles: (user.roles || []).map((r: any) => r.role)
          });
        } else {
          this.errorMessage = 'Utilisateur introuvable.';
        }
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l\'utilisateur.';
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
      username: this.form.value.username,
      email: this.form.value.email,
      address: this.form.value.address,
      enabled: this.form.value.enabled,
      roles: this.form.value.roles.map((r: string) => ({ role: r }))
    };

    if (this.form.value.password) {
      payload.password = this.form.value.password;
    }

    this.loading = true;
    if (this.isEdit && this.id) {
      this.userService.updateUser(this.id, payload).subscribe({
        next: () => this.router.navigate(['/dashboard/users']),
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour.';
          this.loading = false;
        }
      });
    } else {
      if (!payload.password) {
        this.errorMessage = 'Mot de passe requis.';
        this.loading = false;
        return;
      }
      this.userService.createUser(payload as any).subscribe({
        next: () => this.router.navigate(['/dashboard/users']),
        error: () => {
          this.errorMessage = 'Erreur lors de la création.';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/users']);
  }
}
