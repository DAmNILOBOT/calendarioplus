// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';

export interface EventData {
  id?: string;
  title: string;
  date: string;
  time?: string;
  notes?: string;
  userId?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Cria evento (retorna id do documento)
  async createEvent(data: { title: string; date: string; time?: string; notes?: string }) {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não está logado.');

    const event: EventData = {
      title: data.title,
      date: data.date,
      time: data.time ?? '',
      notes: data.notes ?? '',
      userId: user.uid,
      createdAt: Date.now()
    };

    const ref = collection(this.firestore, 'events');
    const docRef = await addDoc(ref, event);
    return docRef.id;
  }

  // Lista todos os eventos (ordenados por createdAt)
  getEvents(): Observable<EventData[]> {
    const ref = collection(this.firestore, 'events');
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<EventData[]>;
  }

  // Lista apenas eventos do usuário atual. Se não tiver usuário, retorna Observable vazio.
  getMyEvents(): Observable<EventData[]> {
    const user = this.auth.currentUser;
    if (!user) {
      // não temos usuário logado (pode retornar [] para evitar erro no subscribe)
      return of([]);
    }
    const ref = collection(this.firestore, 'events');
    const q = query(ref, where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<EventData[]>;
  }

  // Deleta evento por id
  async deleteEvent(eventId: string) {
    if (!eventId) throw new Error('ID do evento inválido.');
    const d = doc(this.firestore, 'events', eventId);
    await deleteDoc(d);
    return true;
  }
}
