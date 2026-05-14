import { Fournisseur } from './fournisseur.model';

export class Produit {

  id_produit!: number;

  nom_produit!: string;

  description!: string;

  prix_unitaire!: number;

  stock_actuel!: number;

  stock_minimum!: number;

  categorie!: string;

  fournisseur!: Fournisseur;
}