import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from '../model/commande.model';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8090/api/commande';

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/all`);
  }

  getCommandeById(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createCommande(commande: Partial<Commande>): Observable<Commande> {
    return this.http.post<Commande>(`${this.apiUrl}/create`, commande);
  }

  updateCommande(id: number, commande: Partial<Commande>): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/update/${id}`, commande);
  }

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getCommandesByStatus(status: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/status/${status}`);
  }

  validateCommande(id: number, comment: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/validate/${id}`, { validationComment: comment });
  }

  rejectCommande(id: number, comment: string): Observable<Commande> {
    return this.http.put<Commande>(`${this.apiUrl}/reject/${id}`, { validationComment: comment });
  }

  // Search and Filter Methods
  searchByName(name: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }

  getPendingCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/pending`);
  }

  getValidatedCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/validated`);
  }

  getCommandeHistoryByFournisseur(fournisseurId: number): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/fournisseur/${fournisseurId}/history`);
  }
}
