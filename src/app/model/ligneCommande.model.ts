import { Commande } from './commande.model';
import { Produit } from './produit.model';

export class LigneCommande {

  id_ligne!: number;

  produit!: string;

  quantite!: number;

  prix_unitaire!: number;

  commande!: Commande;

  produitEntity!: Produit;
}