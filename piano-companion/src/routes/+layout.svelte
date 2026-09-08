<script lang="ts">
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    // Optionally register service worker here or it's auto updated by VitePWA
  });
</script>

<svelte:head>
  <link rel="manifest" href="/manifest.webmanifest" />
</svelte:head>

{@render children()}
