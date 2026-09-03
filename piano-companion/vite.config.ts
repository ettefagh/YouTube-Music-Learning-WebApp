import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({ routes: { include: ['/*'], exclude: ['<all>'] } })
		}),

		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Piano Practice Companion',
				short_name: 'Piano Companion',
				description: 'A piano practice app with YouTube looper and dual audio studio',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
});
