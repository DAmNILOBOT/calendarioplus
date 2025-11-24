import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventbriteService {

  private base = 'https://www.eventbriteapi.com/v3';

  constructor(private http: HttpClient) {}

  getEvents(city: string = 'Brazil', page = 1) {
    let params = new HttpParams()
      .set('q', '')
      .set('location.address', city)
      .set('expand', 'venue,logo')
      .set('page', String(page));

    return this.http.get(`${this.base}/events/search/`, {
      headers: {
        Authorization: `Bearer ${environment.EVENTBRITE_TOKEN}`
      },
      params
    });
  }
}
