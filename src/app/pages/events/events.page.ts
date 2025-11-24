import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, calendarOutline, notificationsOutline, personOutline, ticket, calendar, location, alertCircle, refresh } from 'ionicons/icons'; // Adicionado refresh
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _count = 0;

  setNotificationCount(count: number) {
    this._count = count;
  }

  getNotificationCount() {
    return this._count;
  }
}

@Component({
  standalone: true,
  selector: 'app-events',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Central de Notificações</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="loadEventbrite()">
            <ion-icon name="refresh"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding-vertical">

      <ion-list lines="full">
        <ion-list-header>
          <ion-label>
            <ion-icon name="alert-circle" color="warning" style="vertical-align: middle;"></ion-icon>
            Alertas de Eventos Eventbrite
          </ion-label>
        </ion-list-header>

        <div *ngIf="loading" style="text-align: center; margin-top: 20px;">
          <ion-spinner name="dots"></ion-spinner>
          <p style="color: gray;">Buscando alertas de novos eventos...</p>
        </div>

        <ion-item *ngFor="let item of externalEvents" detail="true" [href]="item.url" target="_blank" class="ion-margin-bottom">
          <ion-icon slot="start" name="ticket" color="tertiary"></ion-icon>
          <ion-label>
            <h2 class="ion-text-wrap" [style.color]="item.isUpcoming ? 'var(--ion-color-danger)' : 'initial'">
              <span *ngIf="item.isUpcoming">🚨 EVENTO PRÓXIMO: </span>
              <strong>{{ item.title }}</strong>
            </h2>
            <p style="font-size: 0.9rem;">
              <ion-icon name="calendar"></ion-icon> {{ item.date }}
              <span *ngIf="item.isOnline">• Online</span>
            </p>
            <p style="font-size: 0.8rem; color: gray;" *ngIf="item.location">
              <ion-icon name="location"></ion-icon> {{ item.location }}
            </p>
          </ion-label>
        </ion-item>

        <div *ngIf="externalEvents.length === 0 && !loading" class="empty-state">
          <ion-icon name="notifications-outline" style="font-size: 4rem; color: #ccc;"></ion-icon>
          <p>Nenhuma notificação de evento externo encontrada no momento.</p>
        </div>
      </ion-list>

    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <div class="bottom-menu" style="display: flex; justify-content: space-around; padding: 10px; font-size: 24px;">
          <ion-icon name="home-outline" (click)="goTo('home')" color="medium"></ion-icon>
          <ion-icon name="calendar-outline" (click)="goTo('calendar')" color="medium"></ion-icon>
          <ion-icon name="notifications-outline" color="primary"></ion-icon> 
          <ion-icon name="person-outline" (click)="goTo('profile')" color="medium"></ion-icon>
        </div>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
      text-align: center;
      color: #666;
      padding: 20px;
    }
  `],
  imports: [IonicModule, CommonModule, HttpClientModule, DatePipe] 
})
export class EventsPage implements OnInit, OnDestroy {
  
  externalEvents: any[] = [];
  loading = false;
  
  private apiKey = 'UR32RU6ZFLVREIR03LJG'; 
  private apiUrl = 'https://www.eventbriteapi.com/v3/organizations/me/events/?status=live,started&expand=venue';

  constructor(
    private toastCtrl: ToastController,
    private http: HttpClient,
    public router: Router,
    private notificationService: NotificationService // <-- Injetado
  ) {
    addIcons({ homeOutline, calendarOutline, notificationsOutline, personOutline, ticket, calendar, location, alertCircle, refresh });
  }

  ngOnInit() {
    this.loadEventbrite();
  }

  goTo(path: string) {
    this.router.navigateByUrl('/' + path);
  }

  async loadEventbrite() {
    if (!this.apiKey) return;

    this.loading = true;
    
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.apiKey}` });

    this.http.get(this.apiUrl, { headers }).subscribe({
      next: (response: any) => {
        let upcomingCount = 0; // Inicializa o contador

        if (response.events && response.events.length > 0) {
          const now = new Date().getTime();
          const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // Uma semana em milissegundos

          this.externalEvents = response.events.map((ev: any) => {
            const startDate = new Date(ev.start.local);
            const timeDifference = startDate.getTime() - now;
            
            // Define o evento como "próximo" se ocorrer dentro de 7 dias
            const isUpcoming = timeDifference > 0 && timeDifference <= oneWeekInMs;
            
            if (isUpcoming) {
                upcomingCount++; // Conta eventos próximos para o Badge
            }

            return {
              id: ev.id,
              title: ev.name.text,
              date: startDate.toLocaleDateString('pt-BR') + ' às ' + startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              url: ev.url,
              isOnline: ev.online_event,
              isUpcoming: isUpcoming, // Usa a nova lógica
              location: ev.venue?.name || (ev.online_event ? 'Evento Online' : 'Local não informado')
            };
          });
        } else {
          this.externalEvents = [];
        }
        
        // ⚡️ ENVIA O NÚMERO DE NOTIFICAÇÕES PARA O SERVIÇO
        this.notificationService.setNotificationCount(upcomingCount);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro API Eventbrite:', err);
        this.presentToast('Erro ao carregar eventos. Verifique a chave API.', 'danger');
        this.notificationService.setNotificationCount(0); // Limpa o badge em caso de erro
        this.loading = false;
      }
    });
  }

  async presentToast(msg: string, color: string = 'dark') {
    const t = await this.toastCtrl.create({ message: msg, duration: 3000, color: color });
    await t.present();
  }

  ngOnDestroy() {
     // Implementação ngOnDestroy para Subscription opcional, mas boa prática.
  }
}
