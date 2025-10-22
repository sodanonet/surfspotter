<template>
  <div class="w-full h-screen relative">
    <!-- Mobile Header -->
    <div class="absolute top-0 left-0 right-0 z-[1000] bg-primary text-primary-content shadow-lg">
      <div class="navbar min-h-[48px] px-2 sm:px-4">
        <div class="flex-1">
          <h1 class="text-lg sm:text-xl font-bold">SurfSpotter</h1>
        </div>
        <div class="flex-none">
          <span class="badge badge-secondary text-xs sm:text-sm">Live</span>
        </div>
      </div>
    </div>

    <!-- Map Container -->
    <div class="w-full h-full pt-[48px]">
      <l-map
        ref="map"
        :zoom="9"
        :center="[33.7, -118.2]"
        class="w-full h-full"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <l-marker
          v-for="spot in spots"
          :key="spot.id"
          :lat-lng="[spot.lat, spot.lng]"
          :icon="getMarkerIcon(spot)"
        >
          <l-popup>
            <div class="p-2 min-w-[200px]">
              <h3 class="text-lg font-bold text-primary mb-2">{{ spot.name }}</h3>
              <div class="flex items-center gap-2">
                <span class="text-sm">Score:</span>
                <div class="badge badge-accent">{{ spot.score }}/100</div>
              </div>
              <div v-if="spot.isTopSpot" class="mt-2">
                <span class="badge badge-secondary text-xs">Top Spot!</span>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';
import L from 'leaflet';
import spotsData from '../data/spots.json';
import '../assets/marker.css';

interface SurfSpot {
  id: number;
  name: string;
  lat: number;
  lng: number;
  score: number;
  isTopSpot: boolean;
}

const spots = ref<SurfSpot[]>(spotsData);

const getMarkerIcon = (spot: SurfSpot) => {
  if (spot.isTopSpot) {
    return L.divIcon({
      className: 'blinking-marker',
      html: '<div class="top-spot-icon">★</div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  } else {
    return L.divIcon({
      className: '',
      html: '<div class="regular-spot-icon"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
