<script>
	import Layout from './Layout.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';


	const { ipcRenderer: ipc } = require('electron');


	function getImages() {
		ipc.send('get-images');
	}

	function selectFile(file){
		selectedFile = file;
	}

	function closeFileDetails(){
		selectedFile = '';
	}

	ipc.on('images', (event, data) => {
			console.log(data.files);
			console.log(data.dir);
			images = data.files;
			dir = data.dir;
	});

	onMount(() => {
		getImages();
	});

	let dir = '';
	let images = [];
	let videos = [];
	let currentTile = 0;

	let selectedFile = '';
	
</script>

<main>
	<Layout>
		<AppShell class='h-screen'>
			<!-- SIDEBAR LEFT -->
			<svelte:fragment slot="sidebarLeft">
				<AppRail>
					<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
						<svelte:fragment slot="lead"><i class="fa-solid fa-image text-2xl" /></svelte:fragment>
						<span>Images</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
						<svelte:fragment slot="lead"><i class="fa-solid fa-film text-2xl" /></svelte:fragment>
						<span>Videos</span>
					</AppRailTile>
					<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
						<svelte:fragment slot="lead"><i class="fa-solid fa-gear text-2xl"></i> </svelte:fragment>
						<span>Settings</span>
					</AppRailTile>
				</AppRail>
			</svelte:fragment>


			<!-- HEADER -->
			<svelte:fragment slot="pageHeader">
				<div class="text-center py-4">
					<!-- TODO: Add autocomplete from skeletonUI -->
					<input class="input rounded-lg w-56 px-2" type="text" placeholder="Search" />
				</div>
			</svelte:fragment>


			<!-- SIDEBAR RIGHT -->
			<svelte:fragment slot="sidebarRight">
				<!-- Display if file is selected showing file details and options -->
				{#if selectedFile !== ''}
					<button class="btn btn-secondary" on:click={closeFileDetails}>close</button>
					<h1 class="text-center">{selectedFile}</h1>
					<p class="text-center"> Image details etc lalalallalalalllalalal</p>
				{/if}
			</svelte:fragment>
			

			<!-- CONTENT  -->
			<div class="rounded-none h-screen grid grid-cols-[auto_1fr] w-full p-5">
				<!-- <div class="grid place-content-center place-items-center"> -->
					{#if currentTile === 0}
						
						<!-- <span class="badge variant-soft">Filebrowser all</span> -->
						
						<div class="w-full text-token grid grid-cols-3 gap-4">
							{#if images !== []}
								{#each images as file}
								<button class="card hover: bg-surface-100 rounded-md overflow-hidden" on:click={selectFile(file)}>
									<header>
										<img src="" class="bg-black/50 w-full aspect-[1/1]" alt="file" />
									</header>
									<div class="p-4 space-y-4">
										<p>{file}</p>
									</div>
								</button>
								{/each}
							{/if}
						</div>

					{:else if currentTile === 1}
						<span class="badge variant-soft">Filebrowser images</span>

					{:else if currentTile === 2}
						<span class="badge variant-soft">Filebrowser videos</span>
					{/if}
				</div>
			<!-- </div> -->
		</AppShell>

	</Layout>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>