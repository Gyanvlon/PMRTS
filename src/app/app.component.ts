import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from "./main/main.component";
import { LandingComponent } from "./landing/landing.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainComponent, LandingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PMRTS';
}
