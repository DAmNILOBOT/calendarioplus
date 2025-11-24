import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Toast } from '@capacitor/toast';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  async notify(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [{
        id: Date.now(),
        title,
        body,
        schedule: { at: new Date(Date.now() + 1000) }
      }]
    });
  }

  async toast(msg: string) {
    await Toast.show({ text: msg });
  }
}
