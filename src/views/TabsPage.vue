<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <!-- Home -->
        <ion-tab-button tab="home" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <!-- Books List -->
        <ion-tab-button tab="books" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="bookOutline" />
          <ion-label>Books List</ion-label>
        </ion-tab-button>

       
      <ion-tab-button tab="add" href="/tabs/tab3">
        <ion-icon aria-hidden="true" :icon="addOutline" />
        <ion-label>Add Book</ion-label>
      </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet,
} from '@ionic/vue'

import {
  homeOutline,
  bookOutline,
  addOutline,
  informationCircleOutline
} from 'ionicons/icons'
</script>
