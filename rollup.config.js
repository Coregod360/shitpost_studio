import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import css from 'rollup-plugin-css-only'
import sveltePreprocess, { scss } from 'svelte-preprocess'

const tailwindConfig = require('./tailwind.config.js')


const production = !process.env.ROLLUP_WATCH

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			})

			process.on('SIGTERM', toExit)
			process.on('exit', toExit)
		}
	}
}

export default {
	input: 'ui/entry.js',
	output: {
		sourcemap: false,
		format: 'iife',
		name: 'app',
		file: 'dist/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ postcss: true }, scss()),
			compilerOptions: {
				dev: !production
			},
		}),
		css({ output: 'bundle.css' }),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}