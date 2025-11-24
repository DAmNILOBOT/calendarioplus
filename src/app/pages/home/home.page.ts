import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { add, homeOutline, calendarOutline, notificationsOutline, personOutline } from 'ionicons/icons';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

// --- COMPONENTE DO MODAL ---
@Component({
  standalone: true,
  selector: 'new-event-modal',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Novo Evento</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Fechar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Título</ion-label>
        <ion-input [(ngModel)]="title" placeholder="Nome do evento"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Data / Hora</ion-label>
        <ion-input [(ngModel)]="date" placeholder="Ex: Hoje • 14:00"></ion-input>
      </ion-item>

      <div class="ion-padding" style="display:flex; justify-content:flex-end; gap:8px;">
        <ion-button fill="clear" (click)="dismiss()">Cancelar</ion-button>
        <ion-button color="primary" (click)="confirm()">Salvar</ion-button>
      </div>
    </ion-content>
  `,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NewEventModal {
  title = '';
  date = '';

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    const payload = { title: this.title || 'Sem título', date: this.date || '' };
    this.modalCtrl.dismiss(payload, 'confirm');
  }
}

// --- COMPONENTE DA HOME (Atualizado) ---
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule]
})
export class HomePage implements OnInit, OnDestroy { // <-- Implementa interfaces

  userName = 'Alice';
  today = new Date();
  notificationCount: number = 0; // <-- Nova variável para o badge
  private notifSubscription?: Subscription; // <-- Para gerenciar a inscrição

  events = [
    { title: 'Consulta médica', date: 'Hoje • 14:00' },
    { title: 'Trabalho da faculdade', date: 'Amanhã • 09:00' },
    { title: 'Reunião de equipe', date: 'Sexta • 16:30' }
  ];

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private notificationService: NotificationService // <-- Injetado
  ) 
  {
    addIcons({ add, homeOutline, calendarOutline, notificationsOutline, personOutline });
  }
  
  ngOnInit() {
    // Inscreve-se para receber atualizações do contador de notificações
    this.notifSubscription = this.notificationService.notificationCount$.subscribe((count: number) => {
      this.notificationCount = count;
    });
  }

  ngOnDestroy() {
    this.notifSubscription?.unsubscribe(); // Limpa a inscrição
  }

  goTo(path: string) {
    console.log('Navegando para:', path);
    this.router.navigateByUrl('/' + path); 
  }

  async openNewEvent() {
    const modal = await this.modalCtrl.create({
      component: NewEventModal,
    });

    modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'confirm') {
      this.events.unshift(data);
    }
  }

}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _count = new BehaviorSubject<number>(0);
  notificationCount$ = this._count.asObservable();

  setCount(count: number) {
    this._count.next(count);
  }

  increment(by: number = 1) {
    this._count.next(this._count.value + by);
  }

  reset() {
    this._count.next(0);
  }
}