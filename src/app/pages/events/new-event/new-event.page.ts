import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-new-event-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Novo evento</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancel()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen class="ion-padding-bottom">
      <ion-list>
        <!-- Título -->
        <ion-item lines="full">
          <ion-label position="stacked">Título *</ion-label>
          <ion-input [(ngModel)]="title" placeholder="Ex: Dentista"></ion-input>
        </ion-item>

        <!-- Data -->
        <ion-item lines="full">
          <ion-label position="stacked">Data *</ion-label>
          <ion-datetime presentation="date" [(ngModel)]="date"></ion-datetime>
        </ion-item>

        <!-- Horário -->
        <ion-item lines="full">
          <ion-label position="stacked">Horário</ion-label>
          <ion-input type="time" [(ngModel)]="time"></ion-input>
        </ion-item>

        <!-- Anotações -->
        <ion-item lines="none">
          <ion-label position="stacked">Anotações</ion-label>
          <ion-textarea [(ngModel)]="notes" placeholder="Observações..." rows="3"></ion-textarea>
        </ion-item>
      </ion-list>

      <div style="padding: 16px;">
        <ion-button expand="block" color="medium" (click)="cancel()" class="ion-margin-bottom">Cancelar</ion-button>
        <ion-button expand="block" color="primary" (click)="saveEvent()">Salvar</ion-button>
      </div>
    </ion-content>
  `
})
export class NewEventModal {
  title = '';
  date = new Date().toISOString(); // Data atual em ISO
  time = '';
  notes = '';

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  cancel() {
    // Fecha o modal sem retornar dados
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async saveEvent() {
    // Validação
    if (!this.title) {
      const toast = await this.toastCtrl.create({
        message: 'Preencha o título do evento.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // Formata a data para exibição (Ex: 23/11/2025)
    const dateObj = new Date(this.date);
    const dateFormatted = dateObj.toLocaleDateString('pt-BR');
    
    // Cria string de data bonita (Ex: "23/11/2025 • 14:30" ou só a data)
    const displayDate = this.time 
      ? `${dateFormatted} • ${this.time}` 
      : dateFormatted;

    // Objeto final para salvar
    const eventData = {
      title: this.title,
      date: displayDate, // Usado para exibir no card da Home
      rawDate: this.date,
      time: this.time,
      notes: this.notes
    };

    // Fecha o modal e envia os dados (eventData) de volta para a Home
    return this.modalCtrl.dismiss(eventData, 'confirm');
  }
}