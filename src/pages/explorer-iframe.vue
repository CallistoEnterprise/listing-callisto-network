<script lang="ts" setup>
import { CALLISTO_CHAIN_CONSTANTS, CALLISTO_CHAIN_ID } from '@callisto-enterprise/chain-constants'
</script>

<template>
  <div>
    <TableAssets style="overflow: auto !important" :chain="CALLISTO_CHAIN_CONSTANTS[CALLISTO_CHAIN_ID.Mainnet]" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: empty
  </route>
