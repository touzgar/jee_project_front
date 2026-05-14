import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transporteur } from '../model/transporteur.model';

@Injectable({
  providedIn: 'root'
})
export class TransporteurService {
  private apiUrl = 'http://localhost:8090/api/transporteur';

  constructor(private http: HttpClient) {}

  getAllTransporteurs(): Observable<Transporteur[]> {
    return this.http.get<Transporteur[]>(`${this.apiUrl}/all`);
  }

  getTransporteurById(id: number): Observable<Transporteur> {
    return this.http.get<Transporteur>(`${this.apiUrl}/${id}`);
  }

  createTransporteur(transporteur: Transporteur): Observable<Transporteur> {
    return this.http.post<Transporteur>(`${this.apiUrl}/create`, transporteur);
  }

  updateTransporteur(id: number, transporteur: Transporteur): Observable<Transporteur> {
    return this.http.put<Transporteur>(`${this.apiUrl}/update/${id}`, transporteur);
  }

  deleteTransporteur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // Search Methods
  searchByName(name: string): Observable<Transporteur[]> {
    return this.http.get<Transporteur[]>(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
  }
}
