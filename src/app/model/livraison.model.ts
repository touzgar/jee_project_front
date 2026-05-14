import { Commande } from './commande.model';
import { Transporteur } from './transporteur.model';

export class Livraison {

  id_livraison!: number;

  date_livraison!: Date;

  cout!: number;

  statut!: string;

  commande!: Commande;

  transporteur!: Transporteur;
}