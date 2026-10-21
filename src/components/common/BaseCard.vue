<script setup lang="ts">
defineProps<{title?:string;icon?:string}>()
</script>
<template><section class="base-card"><div v-if="title||icon" class="card-header"><i v-if="icon" :class="icon" aria-hidden="true"></i><h3 v-if="title">{{title}}</h3></div><slot/></section></template>
<style scoped>.card-header{display:flex;align-items:center;gap:9px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)}.card-header>i{color:var(--primary)}.card-header h3{font-family:var(--font-heading);font-size:1rem;font-weight:700}</style>
