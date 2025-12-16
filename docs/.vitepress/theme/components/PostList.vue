<script setup lang="ts">
import { data as posts } from "../../../posts.data";
</script>

<template>
  <ul class="post-list">
    <li v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-link">
        <span class="post-title">{{ post.title }}</span>
        <time :datetime="new Date(post.date.time).toISOString()" class="post-date">
          {{ post.date.string }}
        </time>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.post-list {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 0;
}

.post-item {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.post-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.post-link:hover .post-title {
  color: var(--vp-c-brand-1);
}

.post-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 400;
  transition: color 0.2s;
}

.post-date {
  flex-shrink: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  white-space: nowrap;
}
</style>

