import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public loggedUser: string = '';
  public isloggedIn: boolean = false;
  public roles: string[] = [];
  apiURL:string='http://localhost:8090';
  token!:string;
  private helper =new JwtHelperService();

  constructor(private router:Router,private http:HttpClient) {}

  
  login(user:User){
    return this.http.post<User>(this.apiURL+'/login',user,{observe:'response'});
  }
  saveToken(jwt:string){
    localStorage.setItem('jwt',jwt);
    this.token=jwt;
    this.isloggedIn=true;
    this.decodeJWT();
  }
  loadToken(){
    this.token=localStorage.getItem('jwt')!;
    this.decodeJWT();
  }
  decodeJWT(){
    if(this.token==undefined)
    return;
    const decodedToken=this.helper.decodeToken(this.token);
    this.roles=decodedToken.roles;
    console.log("roles"+this.roles);
    this.loggedUser=decodedToken.sub;
  
  }


  isAdmin():Boolean{
    if(!this.roles)
    return false;
    return this.roles.indexOf('ADMIN')>=0;
  }

  isUser(): Boolean {
    if(!this.roles)
    return false;
    return this.roles.indexOf('USER')>=0;
  }
  logout() {
    this.isloggedIn = false;
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token=undefined!;
   localStorage.removeItem("jwt");
    this.router.navigate(['/login']);
  }
  isTokenExpired():Boolean{
    return this.helper.isTokenExpired(this.token);
  }
  getToken():string{
    return this.token;
  }
    setLoggedUserFromLocalStorage(login :string){
    this.loggedUser=login;
    this.isloggedIn=true;
   
}

}