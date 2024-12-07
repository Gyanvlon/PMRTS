import { Component, inject, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { LayoutModule } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import {MatGridListModule} from '@angular/material/grid-list';
import {  Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatSidenavModule, MatListModule, LayoutModule, MatGridListModule, RouterModule, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  drawerMode: 'over' | 'side' = 'side';
  collapsed = signal(false);
  #router = inject(Router)
  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe(result => {
      this.drawerMode = result.matches ? 'over' : 'side';
    });
  }
  
  logout() {
    localStorage.removeItem('state');
    this.#router.navigate(['/login']);
  }
}
