<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" class="custom-tab-bar">
        <!-- Home -->
        <ion-tab-button tab="home" href="/tabs/tab1" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="homeOutline" class="tab-icon" />
          <ion-label class="tab-label">Home</ion-label>
        </ion-tab-button>

        <!-- Books List -->
        <ion-tab-button tab="books" href="/tabs/tab2" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="bookOutline" class="tab-icon" />
          <ion-label class="tab-label">Library</ion-label>
        </ion-tab-button>

        <!-- Add Book -->
        <ion-tab-button tab="add" href="/tabs/tab3" class="custom-tab-button">
          <ion-icon aria-hidden="true" :icon="addOutline" class="tab-icon" />
          <ion-label class="tab-label">Add Book</ion-label>
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
} from 'ionicons/icons'
</script>

<style scoped>
.custom-tab-bar {
  --background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-top: 4px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  height: 60px;
  min-height: 60px;
}

.custom-tab-button {
  --color: #6c757d;
  --color-selected: #3880ff;
  transition: all 0.2s ease-in-out;
  border-radius: 12px 12px 0 0;
  margin: 0 2px;
  padding-top: 4px;
}

.custom-tab-button:hover {
  background: rgba(56, 128, 255, 0.05);
}

.custom-tab-button.tab-selected {
  --color: #3880ff;
  background: rgba(56, 128, 255, 0.08);
  position: relative;
}

.custom-tab-button.tab-selected::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #3880ff, #5c9aff);
  border-radius: 0 0 3px 3px;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 2px;
  transition: transform 0.2s ease-in-out;
}

.custom-tab-button.tab-selected .tab-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(56, 128, 255, 0.3));
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2px;
  margin-top: 2px;
  transition: all 0.2s ease-in-out;
}

.custom-tab-button.tab-selected .tab-label {
  font-weight: 600;
  color: #3880ff;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .custom-tab-bar {
    --background: linear-gradient(180deg, #1e1e1e 0%, #2d2d2d 100%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  }

  .custom-tab-button {
    --color: #9ca3af;
    --color-selected: #5c9aff;
  }

  .custom-tab-button:hover {
    background: rgba(92, 154, 255, 0.1);
  }

  .custom-tab-button.tab-selected {
    --color: #5c9aff;
    background: rgba(92, 154, 255, 0.15);
  }

  .custom-tab-button.tab-selected::before {
    background: linear-gradient(90deg, #5c9aff, #7ab3ff);
  }
}

/* Enhanced mobile experience */
@media (max-width: 768px) {
  .custom-tab-bar {
    height: 65px;
    min-height: 65px;
  }

  .tab-icon {
    font-size: 26px;
  }

  .tab-label {
    font-size: 12px;
  }
}
</style>
