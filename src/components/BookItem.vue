<template>
  <ion-item>
    <ion-label>
      <h3>{{ book.title }}</h3>
      <p>Author: {{ book.author }}</p>
      <p>Year: {{ book.year }} · Category: {{ book.category }}</p>
      <p>Status: {{ book.isAvailable ? 'Available' : 'Borrowed' }}</p>
    </ion-label>

    <!-- Edit button -->
    <ion-button
      fill="outline"
      size="small"
      slot="end"
      @click="$emit('edit', book)"
    >
      Edit
    </ion-button>

    <!-- Delete button -->
    <ion-button
      color="danger"
      fill="outline"
      size="small"
      slot="end"
      @click="$emit('delete', book.id)"
    >
      Delete
    </ion-button>
  </ion-item>
</template>

<script setup lang="ts">
import { IonItem, IonLabel, IonButton } from '@ionic/vue'

interface Book {
  id: number
  title: string
  author: string
  year: number | string
  category: string
  isAvailable: number | boolean | string
}

defineProps<{
  book: Book
}>()

defineEmits<{
  (e: 'edit', book: Book): void
  (e: 'delete', id: number): void
}>()
</script>

<style scoped>
h3 {
  font-size: 1rem;
  font-weight: 600;
}

p {
  margin: 2px 0;
  font-size: 0.85rem;
}
</style>
