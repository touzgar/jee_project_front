import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livraison } from '../model/livraison.model';

@Injectable({
  providedIn: 'root'
})
export class LivraisonService {
  private apiUrl = 'http://localhost:8090/api/livraison';

  constructor(private http: HttpClient) {}

  getAllLivraisons(): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/all`);
  }

  getLivraisonById(id: number): Observable<Livraison> {
    return this.http.get<Livraison>(`${this.apiUrl}/${id}`);
  }

  createLivraison(livraison: Partial<Livraison>): Observable<Livraison> {
    return this.http.post<Livraison>(`${this.apiUrl}/create`, livraison);
  }

  updateLivraison(id: number, livraison: Partial<Livraison>): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/update/${id}`, livraison);
  }

  deleteLivraison(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  updateStatus(id: number, status: string): Observable<Livraison> {
    return this.http.put<Livraison>(`${this.apiUrl}/update-status/${id}?status=${encodeURIComponent(status)}`, {});
  }

  // Search and Filter Methods
  searchByStatut(statut: string): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/search?statut=${encodeURIComponent(statut)}`);
  }

  getByCommande(commandeId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/commande/${commandeId}`);
  }

  getByTransporteur(transporteurId: number): Observable<Livraison[]> {
    return this.http.get<Livraison[]>(`${this.apiUrl}/transporteur/${transporteurId}`);
  }
}
