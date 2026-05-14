import { Component, OnInit } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { Produit } from '../../../model/produit.model';

@Component({
  selector: 'app-produit-low-stock',
  templateUrl: './produit-low-stock.component.html',
  styleUrls: ['./produit-low-stock.component.css']
})
export class ProduitLowStockComponent implements OnInit {
  lowStock: Produit[] = [];
  loading = false;

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loading = true;
    this.produitService.getLowStockProducts().subscribe({
      next: (data) => {
        this.lowStock = data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
