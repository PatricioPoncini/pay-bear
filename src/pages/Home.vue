<script setup lang="ts">
import HomeCard from "../components/HomeCard.vue";
</script>

<template>
  <div class="grid grid-cols-1">
    <div class="flex flex-col items-center gap-4 pt-10">
      <h1 class="text-4xl sm:text-5xl font-semibold text-[#eab308]">CryptoExchange Pay Bear</h1>
      <p class="text-lg sm:text-xl text-gray-500">Your portal to the cryptocurrency world</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-12 place-items-center mt-10 sm:mt-20">
        <HomeCard
            title="Buy Cryptocurrencies"
            description="Get your favorite cryptocurrencies"
            route-to="buy"
            button-text="Buy Now"
            text-color="#eab308"
        />
        <HomeCard
            title="Sell Cryptocurrencies"
            description="Sell your cryptocurrencies securely"
            route-to="sell"
            button-text="Sell Now"
            text-color="#22c55e"
        />
        <HomeCard
            title="Transaction History"
            description="Review your past transactions"
            route-to="transaction-history"
            button-text="View History"
            text-color="#3b82f6"
        />
        <HomeCard
            title="Investment Analysis"
            description="Analyze the performance of your investments"
            route-to="analysis"
            button-text="View Analysis"
            text-color="#a855f7"
        />
      </div>
    </div>
  </div>
</template>
