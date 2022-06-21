const daisyui = require('daisyui');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				mine: {
					primary: '#057AFF',
					secondary: '#67e8f9',
					accent: '#d8b4fe',
					neutral: '#021431',
					'base-100': '#FFFFFF',
					info: '#2563eb',
					success: '#22c55e',
					warning: '#eab308',
					error: '#f87171'
				}
			}
		],
		dark: 'mine'
	},

	plugins: [daisyui]
};

module.exports = config;
