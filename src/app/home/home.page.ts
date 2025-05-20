import { Component, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { IonicModule } from "@ionic/angular";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, NgIf,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class HomePage implements OnDestroy {
  latitude: number | null = null;
  longitude: number | null = null;
  mostrandoMensajeCarga = false;
  watchId: string | null = null;

  async obtenerUbicacion() {
    this.mostrandoMensajeCarga = true;

    try {
      // Cancelar cualquier watch anterior
      if (this.watchId) {
        await Geolocation.clearWatch({ id: this.watchId });
        this.watchId = null;
      }

      if (Capacitor.isNativePlatform()) {
        // Para móvil nativo
        await Geolocation.requestPermissions();

        this.watchId = await Geolocation.watchPosition({}, (position: Position | null, err) => {
          if (position) {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          } else if (err) {
            console.error('Error al obtener posición:', err);
          }
        });
      } else {
        // Para navegador web
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
          },
          (error) => {
            console.error('Error en geolocalización del navegador:', error);
          }
        );
      }

    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    } finally {
      this.mostrandoMensajeCarga = false;
    }
  }

  openInGoogleMaps() {
    if (this.latitude !== null && this.longitude !== null) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${this.latitude},${this.longitude}`,
        '_blank'
      );
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}