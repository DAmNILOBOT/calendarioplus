import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

// IMPORTS NECESSÁRIOS PARA STANDALONE
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true, // <--- ESSENCIAL
  imports: [IonicModule, CommonModule, FormsModule], // <--- SEMPRE NECESSÁRIO
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  name = '';
  email = '';
  password = '';
  confirm = '';

  constructor(private router: Router, private auth: AuthService) {}

  async register() {
    if (!this.name || !this.email || !this.password || !this.confirm) {
      alert('Preencha todos os campos!');
      return;
    }

    if (this.password !== this.confirm) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      await this.auth.signUp(this.email, this.password, {
        name: this.name,
        email: this.email
      });

      alert('Conta criada com sucesso!');
      this.router.navigateByUrl('/login');

    } catch (err: any) {
      alert('Erro ao cadastrar: ' + err.message);
    }
  }

  goLogin() {
    this.router.navigateByUrl('/login');
  }
}

