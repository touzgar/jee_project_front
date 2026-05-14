import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../model/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  searchTerm = '';
  loading = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data || [];
        this.filtered = [...this.users];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des utilisateurs.';
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim();
    if (!term) {
      this.filtered = [...this.users];
      return;
    }

    this.loading = true;
    this.userService.searchByUsername(term).subscribe({
      next: (data) => {
        this.filtered = data || [];
        this.loading = false;
      },
      error: () => {
        this.filtered = this.users.filter((u) =>
          [u.username, u.email, u.address, u.password]
            .filter(Boolean)
            .some((val) => String(val).toLowerCase().includes(term.toLowerCase()))
        );
        this.loading = false;
      }
    });
  }

  toggleEnabled(u: User): void {
    const action$ = u.enabled
      ? this.userService.deactivateUser(u.userId)
      : this.userService.activateUser(u.userId);

    action$.subscribe({
      next: () => {
        u.enabled = !u.enabled;
      },
      error: () => {
        this.errorMessage = 'Mise à jour impossible.';
      }
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.userId !== id);
      },
      error: () => {
        this.errorMessage = 'Suppression impossible.';
      }
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/dashboard/users/edit', id]);
  }

  roleNames(u: User): string {
    return (u.roles || []).map(r => r.role).join(', ');
  }
}
