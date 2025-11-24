import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class FilesystemService {
  private fileName = 'events.json';

  async save(events: any[]) {
    await Filesystem.writeFile({
      path: this.fileName,
      data: JSON.stringify(events),
      directory: Directory.Data
    });
  }

  async load() {
    try {
      const r = await Filesystem.readFile({
        path: this.fileName,
        directory: Directory.Data
      });
      return JSON.parse(r.data);
    } catch {
      return [];
    }
  }
}
