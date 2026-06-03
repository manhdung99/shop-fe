<template>
  <RouterLink :to="`/san-pham/${product.slug}`" class="group block">
    <!-- Image container -->
    <div class="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[3/4]">
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <!-- Second image on hover -->
      <img
        v-if="product.images[1]"
        :src="product.images[1]"
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <!-- Gradient overlay bottom -->
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <!-- Badges top-left -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5">
        <span v-if="product.isNew" class="badge-new">MỚI</span>
        <span v-if="product.isSale && product.originalPrice" class="badge-sale">
          -{{ discountPercent(product.originalPrice, product.price) }}%
        </span>
      </div>

      <!-- Quick add – slide up on hover -->
      <div class="absolute inset-x-3 bottom-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <button
          @click.prevent="$emit('quick-add', product)"
          class="w-full bg-white/95 glass text-gray-900 text-xs font-bold py-3 rounded-xl hover:bg-white transition-colors shadow-lg tracking-wider"
        >
          CHỌN SIZE
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="mt-3 px-0.5 space-y-1">
      <p class="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">{{ product.brand }}</p>
      <p class="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-600 transition-colors">
        {{ product.name }}
      </p>
      <div class="flex items-center gap-2 pt-0.5">
        <span class="text-sm font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="text-xs text-gray-400 line-through font-normal">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>
      <!-- Rating -->
      <div v-if="showRating" class="flex items-center gap-1.5">
        <div class="flex">
          <span v-for="i in 5" :key="i" class="text-xs leading-none"
            :class="i <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'"
          >★</span>
        </div>
        <span class="text-xs text-gray-400">({{ product.reviewCount }})</span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Product } from '@/types'
import { formatPrice, discountPercent } from '@/utils/format'

defineProps<{ product: Product; showRating?: boolean }>()
defineEmits<{ 'quick-add': [product: Product] }>()
</script>
