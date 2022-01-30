import { Component } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <h1> Welcome to the blog! </h1>
    <ul>
      <li>
    <a routerLink="/blog">Blog</a></li>
    <li><a *ngFor="let route of (routes$ |async)" [routerLink]="route.route">{{route.title}}</a></li>
    </ul>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  routes$: Observable<ScullyRoute[]> = this.service.available$.pipe(map(routes => routes.filter(route => route.route.startsWith('/blog'))));
  constructor(private readonly service: ScullyRoutesService) { }
}
