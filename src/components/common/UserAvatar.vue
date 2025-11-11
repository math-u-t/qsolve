<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'md'
  }
)

const sizeClass = computed(() => `avatar-${props.size}`)
</script>

<template>
  <div class="user-avatar" :class="sizeClass">
    <img :src="src" :alt="alt" />
  </div>
</template>

<style scoped>
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  display: inline-block;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-sm {
  width: 32px;
  height: 32px;
}

.avatar-md {
  width: 48px;
  height: 48px;
}

.avatar-lg {
  width: 64px;
  height: 64px;
}

.avatar-xl {
  width: 96px;
  height: 96px;
}
</style>
