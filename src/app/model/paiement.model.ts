import { Commande } from './commande.model';

export class Paiement {

  id_paiement!: number;

  date_paiement!: Date;

  statut!: string;

  mode!: string;

  commande!: Commande;
}