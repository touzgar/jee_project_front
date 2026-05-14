import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private jwtHelper: JwtHelperService, private router: Router) {}

  private hasAdminRole(token: string): boolean {
    try {
      const decoded: any = this.jwtHelper.decodeToken(token) || {};
      // Try common claim names
      const roles = decoded.roles || decoded.authorities || decoded.role || decoded.authoritiesList || [];
      if (Array.isArray(roles)) {
        return roles.includes('ADMIN') || roles.includes('ROLE_ADMIN');
      }
      if (typeof roles === 'string') {
        return roles === 'ADMIN' || roles === 'ROLE_ADMIN' || roles.includes('ADMIN');
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      try { localStorage.removeItem('jwt'); } catch (e) {}
      this.router.navigate(['/']);
      return false;
    }

    if (!this.hasAdminRole(token)) {
      // Redirect to dashboard (or home) if not admin
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}
