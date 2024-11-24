import { Component } from '@angular/core';
import {SessionStorageService} from '../services/session-storage/session-storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent {

  constructor(private sessionStorage: SessionStorageService, private router: Router) {}

  logout() {
    this.sessionStorage.clear()
    this.router.navigate([''])
  }
}
