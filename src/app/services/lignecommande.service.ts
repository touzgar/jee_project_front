import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LigneCommande } from '../model/ligneCommande.model';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService {
  private apiUrl = 'http://localhost:8090/api/lignecommande';

  constructor(private http: HttpClient) {}

  getAllLignes(): Observable<LigneCommande[]> {
    return this.http.get<LigneCommande[]>(`${this.apiUrl}/all`);
  }

  getLigneById(id: number): Observable<LigneCommande> {
    return this.http.get<LigneCommande>(`${this.apiUrl}/${id}`);
  }

  createLigne(ligne: Partial<LigneCommande>): Observable<LigneCommande> {
    return this.http.post<LigneCommande>(`${this.apiUrl}/create`, ligne);
  }

  updateLigne(id: number, ligne: Partial<LigneCommande>): Observable<LigneCommande> {
    return this.http.put<LigneCommande>(`${this.apiUrl}/update/${id}`, ligne);
  }

  deleteLigne(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Search and Filter Methods
  searchByProduit(produit: string): Observable<LigneCommande[]> {
    return this.http.get<LigneCommande[]>(`${this.apiUrl}/search?produit=${encodeURIComponent(produit)}`);
  }

  getLignesByCommande(commandeId: number): Observable<LigneCommande[]> {
    return this.http.get<LigneCommande[]>(`${this.apiUrl}/commande/${commandeId}`);
  }
}
