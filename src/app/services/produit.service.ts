import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../model/produit.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8090/api/produit';

  constructor(private http: HttpClient) {}

  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/all`);
  }

  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/create`, produit);
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/update/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  getLowStockProducts(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/low-stock`);
  }

  // Search and Filter Methods
  searchByName(name: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }

  searchByCategorie(categorie: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search/categorie?categorie=${encodeURIComponent(categorie)}`);
  }

  getByFournisseur(fournisseurId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/fournisseur/${fournisseurId}`);
  }
}
