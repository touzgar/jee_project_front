import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FastTrack Logistics';

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authService.loadToken();
  }
}
