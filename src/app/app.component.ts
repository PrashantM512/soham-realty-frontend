import { Component } from '@angular/core';
import { LayoutComponent } from './components/shared/layout/layout.component';
import { ViewportScroller } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `
    <app-layout></app-layout>
  `,
  styles: []
})
export class AppComponent {
  title = 'Soham Realty';
  constructor(private router: Router, private viewportScroller: ViewportScroller) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}