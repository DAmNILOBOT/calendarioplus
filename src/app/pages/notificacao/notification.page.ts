// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Inicializa o contador com 0
  private notificationCountSubject = new BehaviorSubject<number>(0);
  public notificationCount$: Observable<number> = this.notificationCountSubject.asObservable();

  constructor() { }

  // Esta função é chamada pela EventsPage após buscar a API
  setNotificationCount(count: number) {
    this.notificationCountSubject.next(count);
  }
}