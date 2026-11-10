// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Guía Interactiva Python',
			// Single-language site: Spanish served at the root (no /es/ prefix).
			locales: {
				root: { label: 'Español', lang: 'es' },
			},
			sidebar: [
				{
					label: 'Ruta de estudio',
					items: [
						{ label: '0. Nivelación express', slug: 'modulo-0-basicos' },
						{ label: '1. Condicionales (if/elif/else)', slug: 'modulo-1-condicionales' },
						{ label: '2. Ciclos definidos (for)', slug: 'modulo-2-ciclos-for' },
						{ label: '3. Ciclos indefinidos (while)', slug: 'modulo-3-ciclos-while' },
						{ label: '4. Listas', slug: 'modulo-4-listas' },
						{ label: '5. Simulacro de prueba', slug: 'modulo-5-simulacro' },
					],
				},
			],
		}),
	],
});
