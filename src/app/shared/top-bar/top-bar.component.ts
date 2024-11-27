import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { LocalStorageService } from '../services/local-storage/local-storage.service';

@Component({
  selector: 'app-top-bar',
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss',
  standalone: true
})
export class TopBarComponent {

  constructor(private sessionStorage: LocalStorageService, private router: Router) {}

  logout() {
    this.sessionStorage.clear()
    this.router.navigate([''])
  }
}
