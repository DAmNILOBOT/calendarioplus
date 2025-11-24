import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class CalendarPage {
  // data selecionada no calendário
  selectedDate: string = new Date().toISOString();

  // exemplo local de eventos (em produção traga do Firestore)
  eventsByDate: Record<string, Array<{ id: string; title: string; time?: string; note?: string }>> = {};

  constructor(public router: Router, private alertCtrl: AlertController) {
    // eventos de exemplo (formato YYYY-MM-DD)
    const todayKey = this.isoToKey(new Date());
    this.eventsByDate[todayKey] = [
      { id: '1', title: 'Consulta médica', time: '14:00', note: 'Levar documentação' },
      { id: '2', title: 'Aula de Angular', time: '19:00', note: 'Estudar módulos' }
    ];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.eventsByDate[this.isoToKey(tomorrow)] = [
      { id: '3', title: 'Apresentação trabalho', time: '10:00', note: 'Preparar slides' }
    ];
  }

  // converte ISO para chave YYYY-MM-DD
  isoToKey(d: Date | string) {
    const date = typeof d === 'string' ? new Date(d) : d;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // chamada quando o ion-datetime muda
  onDateChange(event: any) {
    this.selectedDate = event.detail.value;
  }

  // retorna lista de eventos para a data selecionada
  get eventsForSelected() {
    const key = this.isoToKey(this.selectedDate);
    return this.eventsByDate[key] ?? [];
  }

  // ir para criar novo evento (rota /events/new ou outra que você tenha)
  newEvent() {
    // navega para página de criação (implemente a rota /events/new)
    this.router.navigateByUrl('/events');
  }

  // editar ou visualizar evento
  async viewEvent(ev: { id: string; title: string; time?: string; note?: string }) {
    const alert = await this.alertCtrl.create({
      header: ev.title,
      subHeader: ev.time ?? '',
      message: ev.note ?? 'Sem observações',
      buttons: [
        { text: 'Fechar', role: 'cancel' },
        { text: 'Editar', handler: () => this.router.navigateByUrl(`/events` ) },
        { text: 'Deletar', role: 'destructive', handler: () => this.deleteEvent(ev.id) }
      ]
    });
    await alert.present();
  }

  // remove evento de exemplo (em produção remova do Firestore)
  deleteEvent(id: string) {
    const key = this.isoToKey(this.selectedDate);
    this.eventsByDate[key] = (this.eventsByDate[key] ?? []).filter(e => e.id !== id);
  }
}
