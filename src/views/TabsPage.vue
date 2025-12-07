<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" class="modern-tab-bar">
        <!-- Home -->
        <ion-tab-button tab="home" href="/tabs/tab1" class="modern-tab-button">
          <div class="tab-indicator"></div>
          <ion-icon aria-hidden="true" :icon="homeOutline" class="tab-icon" />
          <ion-label class="tab-label">Home</ion-label>
        </ion-tab-button>

        <!-- Books List -->
        <ion-tab-button tab="books" href="/tabs/tab2" class="modern-tab-button">
          <div class="tab-indicator"></div>
          <ion-icon aria-hidden="true" :icon="bookOutline" class="tab-icon" />
          <ion-label class="tab-label">Library</ion-label>
        </ion-tab-button>

        <!-- Add Book -->
        <ion-tab-button tab="add" href="/tabs/tab3" class="modern-tab-button">
          <div class="tab-indicator"></div>
          <ion-icon aria-hidden="true" :icon="addOutline" class="tab-icon" />
          <ion-label class="tab-label">Add</ion-label>
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
.modern-tab-bar {
  --background: transparent;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.85);
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  height: 72px;
  min-height: 72px;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modern-tab-button {
  --color: #94a3b8;
  --color-selected: #1e293b;
  position: relative;
  overflow: visible;
  background: transparent;
  padding: 0;
  margin: 0;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-indicator {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 28px;
  height: 3px;
  background: #1e293b;
  border-radius: 2px;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-tab-button.tab-selected .tab-indicator {
  transform: translateX(-50%) scaleX(1);
  opacity: 1;
}

.tab-icon {
  font-size: 22px;
  margin-bottom: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: grayscale(100%);
  opacity: 0.7;
}

.modern-tab-button.tab-selected .tab-icon {
  font-size: 24px;
  filter: grayscale(0%);
  opacity: 1;
  color: #1e293b;
}

.tab-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  opacity: 0.7;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-tab-button.tab-selected .tab-label {
  opacity: 1;
  font-weight: 600;
  color: #1e293b;
}

/* Add subtle hover effect */
.modern-tab-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

.modern-tab-button:hover::after {
  transform: translate(-50%, -50%) scale(1);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modern-tab-bar {
    background: rgba(15, 23, 42, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .modern-tab-button {
    --color: #64748b;
    --color-selected: #f1f5f9;
  }

  .tab-indicator {
    background: #f1f5f9;
  }

  .modern-tab-button.tab-selected .tab-icon {
    color: #f1f5f9;
  }

  .modern-tab-button.tab-selected .tab-label {
    color: #f1f5f9;
  }

  .modern-tab-button::after {
    background: rgba(255, 255, 255, 0.05);
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .modern-tab-bar {
    height: 76px;
    min-height: 76px;
    padding-bottom: max(env(safe-area-inset-bottom, 0), 8px);
  }

  .tab-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .modern-tab-button.tab-selected .tab-icon {
    font-size: 26px;
  }

  .tab-label {
    font-size: 12px;
  }
}

/* Add micro-interaction for active state */
@keyframes tabPress {
  0% { transform: scale(1); }
  50% { transform: scale(0.92); }
  100% { transform: scale(1); }
}

.modern-tab-button:active .tab-icon {
  animation: tabPress 0.2s ease;
}
</style>