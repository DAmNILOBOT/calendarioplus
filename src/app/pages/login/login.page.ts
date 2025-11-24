import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  async login() {
    if (!this.email || !this.password) {
      alert('Preencha email e senha.');
      return;
    }

    try {
      await this.auth.signIn(this.email, this.password);
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (err: any) {
      alert(err?.message || 'Erro ao entrar.');
    }
  }
  
  forgotPassword() {
  // placeholder simples — substituir pela lógica real (firebase) depois
  alert('Enviaremos um e-mail de recuperação — função em construção.');
}

  goRegister() {
    this.router.navigateByUrl('/register');
  }
}
