import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class ProfilePage {

  user = {
    name: 'Alice Matheus',
    email: 'alice@email.com',
    photo: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  };

  constructor(public router: Router, private alertCtrl: AlertController) {}


  async editProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      message: 'Função em construção!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Senha',
      message: 'Função em construção!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Deseja realmente sair da sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          role: 'destructive',
          handler: () => this.router.navigateByUrl('/login', { replaceUrl: true })
        }
      ]
    });
    await alert.present();
  }

}
