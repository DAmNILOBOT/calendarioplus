import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  afs: any;
  constructor(private afAuth: AngularFireAuth) {}

  async currentUserId(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }

  signUp(email: string, password: string, profile: any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(async (cred) => {
        await this.afs.collection('users').doc(cred.user?.uid).set(profile);
        return cred;
      });
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut() {
    return this.afAuth.signOut();
  }
}
