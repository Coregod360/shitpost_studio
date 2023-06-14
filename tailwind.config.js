module.exports = {
	darkMode: 'class',
	content: [
		'./ui/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve(
			'@skeletonlabs/skeleton'),
			'../**/*.{html,js,svelte,ts}'
		)
	],
	theme: {
		extend: {},
	},
	plugins: [
		...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
	]
}