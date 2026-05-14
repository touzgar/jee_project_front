import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    const isExpired = this.jwtHelper.isTokenExpired(token);
    if (isExpired) {
      try { localStorage.removeItem('jwt'); } catch (e) {}
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
