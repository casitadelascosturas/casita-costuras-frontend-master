import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UtilsService } from '../../shared/services/utils/utils.service';
import { ResponseApi } from '../../shared/interfaces/response-api';

@Component({
  selector: 'app-user-verify',
  standalone: true,
  imports: [],
  templateUrl: './user-verify.component.html',
  styleUrl: './user-verify.component.scss'
})
export default class UserVerifyComponent implements OnInit{

  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private utils: UtilsService,
    private router: Router) {}

    ngOnInit(): void {
      this.utils.hideLoader();
      this.route.queryParamMap.subscribe(params => {
        this.token = params.get('token');
        if (this.token) {
          const infoToken = this.authService.decodeTokenVerify(this.token);
          console.log(infoToken);
          if (infoToken && infoToken.email) {
          // if (infoToken && infoToken.email && this.isTokenValid(infoToken)) {
            this.verifyUser(infoToken);
          }
        } else {
          this.utils.info('Token inválido!');
          this.navitageToLogin();
        }
      });
    }
    

    // isTokenValid(infoToken: { email: string, exp: number, iat: number }): boolean {
    //   const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    //   const tokenExpiration = infoToken.exp; // Fecha de expiración del token en segundos
    
    //   // Depuración: Mostrar tiempos
    //   console.log('Fecha actual (timestamp Unix):', currentTime);
    //   console.log('Fecha de expiración del token (timestamp Unix):', tokenExpiration);
    //   console.log('Fecha actual:', new Date(currentTime * 1000).toLocaleString());
    //   console.log('Fecha de expiración del token:', new Date(tokenExpiration * 1000).toLocaleString());
    
    //   // Verificar si el token ha expirado
    //   if (tokenExpiration <= currentTime) {
    //     console.log('El token ha expirado.');
    //     return false; // Token expirado
    //   }
    
    //   // El token es válido si aún no ha expirado
    //   return true;
    // }
    

    
    verifyUser(infoToken: { email: string, exp: number, iat: number }) {
      console.log('Usuario a verificar: ', infoToken.email);
      this.authService.verifyUser(infoToken.email).subscribe({
        next: ((response: ResponseApi) => this.responseAPI(response)),
        error: ((error) => this.utils.error('Error de servidor!'))
      })
    }

    responseAPI(response: ResponseApi){
      if (response.code === 201 || response.code === 200) {
        this.utils.success(response.message);
        this.navitageToLogin();
      }else if (response.code === 100) {
        this.utils.info(response.message);
        this.navitageToLogin();
      } else if (response.code !== 200) {
        this.utils.error(response.message, `Error ${response.code}`);
      }
    }

    navitageToLogin(){
      this.router.navigate(['/authentication/login']);
    }
    
}
