import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paiement } from '../model/paiement.model';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private apiUrl = 'http://localhost:8090/api/paiement';

  constructor(private http: HttpClient) {}

  getAllPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/all`);
  }

  getPaiementById(id: number): Observable<Paiement> {
    return this.http.get<Paiement>(`${this.apiUrl}/${id}`);
  }

  createPaiement(paiement: Partial<Paiement>): Observable<Paiement> {
    return this.http.post<Paiement>(`${this.apiUrl}/create`, paiement);
  }

  updatePaiement(id: number, paiement: Partial<Paiement>): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/update/${id}`, paiement);
  }

  deletePaiement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Search and Filter Methods
  searchByStatut(statut: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/search/statut?statut=${encodeURIComponent(statut)}`);
  }

  searchByMode(mode: string): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/search/mode?mode=${encodeURIComponent(mode)}`);
  }

  getByCommande(commandeId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/commande/${commandeId}`);
  }
}
