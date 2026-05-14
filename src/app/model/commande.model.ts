import { User } from './user.model';

export class Commande {
  id_commande!: number;

  nomCommande!: string;

  date_commande!: Date;

  status_commande!: boolean;

  montant_commande!: number;

  validationStatus!: string;

  validationDate!: Date;

  validationComment!: string;

  user!: User;
}