<script>
	import Layout from './Layout.svelte';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
    import { onMount } from 'svelte';


	const { ipcRenderer: ipc } = require('electron');

	let imageBasePath = '';
	let videoBasePath = '';
	let defaultVolume = '';


	let images = [];
	let videos = [];
	let currentTile = 0;
	let selectedFile = '';

	// IPC funtions 

	function getImages() {
		ipc.send('get-images');
	}

	function getVideos() {
		ipc.send('get-videos');
	}

	function getUserConfig() {
		ipc.send('get-user-config');
	}

	function scanImages() {
		ipc.send('scan-images');
	}

	function downloadVideo() {
		ipc.send('download-video');
	}

	ipc.on('images', (event, data) => {
			console.log(data);
			images = data.images;
			// imageBasePath = data.dir;
	});

	ipc.on('videos', (event, data) => {
			console.log(data);
			videos = data.videos;
			// videoBasePath = data.dir;
	});

	ipc.on('user-config', (event, data) => {
			console.log(data);
			imageBasePath = data.imageBasePath;
			videoBasePath = data.videoBasePath;
			defaultVolume = data.defaultVolume;
	});

	//Page functions 
	onMount(() => {
		getUserConfig();
	});


	function selectFile(file){
		if (currentTile === 0){
			selectedFile = file;
		}
		if (currentTile === 1){
			selectedFile = file;
			let video = document.getElementById('videoPreview');
			console.log(video);
			video.src = `file://${videoBasePath}${selectedFile}`;
			// TODO: Make user dependent audio volume
			// Has bug where first time selecting video it will play at full volume because get element returns null
			video.volume = defaultVolume;
			video.load(selectedFile);
		}
		
	}

	function closeFileDetails(){
		selectedFile = '';
	}

	function showfilepicker(){
		showDirectoryPicker();
	}

	// Resets file selection when switching between image and videos 
	$: if(currentTile){
		selectedFile = '';
		console.log('reset file selection');
	}
	
	$: if(currentTile === 0){
		if(images.length === 0){
			getImages();
		}
		// console.log('Images already loaded');
	}

	$: if(currentTile === 1){
		if(videos.length === 0){
			getVideos();
		}
		// console.log('videos already loaded');
	}

	$: if(currentTile === 2){
		// Get settings
		console.log('settings');
	}

</script>

<main>
	<Layout>
		<AppShell class='h-screen'>
			<!-- SIDEBAR LEFT -->
			<svelte:fragment slot="sidebarLeft">
				<AppRail>
					<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1" on:click{test}>
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
				{#if currentTile === 0}
				<div class="text-center py-4">
					<!-- TODO: Add autocomplete from skeletonUI -->
					<input class="input rounded-lg w-56 px-2" type="text" placeholder="Search" />
					<button class="btn btn-primary" on:click={scanImages}>scan folder</button>
				</div>
				{/if}

				{#if currentTile === 1}
				<div class="text-center py-4">
					<input class="input rounded-lg w-56 px-2" type="text" placeholder="Search" />
					<button class="btn btn-primary">download video</button>
				</div>
				{/if}

				{#if currentTile === 2}
					<!-- Nothing to do here  -->
				{/if}

			</svelte:fragment>


			<!-- SIDEBAR RIGHT -->
			<svelte:fragment slot="sidebarRight">
				<!-- Display if file is selected showing file details and options -->
				
				{#if selectedFile !== ''}
					{#if currentTile === 0}
						<div class="flex flex-col max-w-md px-2 justify-center">
							<button class="btn btn-secondary justify-end" on:click={closeFileDetails}><i class="fa-solid fa-x"></i></button>
							<img src={`file://${imageBasePath}${selectedFile}`} class="w-screen" alt="file" />
							<h1 class="text-center pt-2">{selectedFile}</h1>
							<p> File info </p>
						</div>
					{/if}

					{#if currentTile === 1}
						<div class="flex flex-col max-w-md px-2 justify-center"> 
							<button class="btn btn-secondary justify-end" on:click={closeFileDetails}><i class="fa-solid fa-x"></i></button>
							<video id='videoPreview' class="w-screen" controls autoplay loop> 
								<source src={`file://${videoBasePath}${selectedFile}`} type="video/mp4" />
								<track kind="captions" />
							</video>
							<h1 class="text-center pt-2">{selectedFile}</h1>
							<p> File info</p>
						</div>
					{/if}
				{/if}
			</svelte:fragment>
			

			<!-- CONTENT  -->
			<!-- <div class="rounded-none h-screen grid grid-cols-[auto_1fr] w-full p-5"> -->
					{#if currentTile === 0}
					<div class="rounded-none h-screen grid grid-cols-[auto_1fr] w-full p-5">
						<div class="w-full text-token grid grid-cols-4 gap-4">
							{#if images !== []}
								{#each images as file}
								<button class="card hover: bg-surface-100 rounded-md overflow-hidden" on:click={selectFile(file)}>
									<header>
										<!-- TODO: Fix image squishing  -->
										<img src={`file://${imageBasePath}${file}`} class="bg-black/50 w-full aspect-square" alt="file" />
									</header>
									<div class="p-4 space-y-4">
										<p>{file}</p>
									</div>
								</button>
								{/each}
							{/if}
						</div>
					</div>

					{:else if currentTile === 1}
					<div class="rounded-none h-screen grid grid-cols-[auto_1fr] w-full p-5">
						<div class="w-full text-token grid grid-cols-4 gap-4">
							{#if videos !== []}
								{#each videos as file}
								<!-- TODO: Fix video not changing when selecting  -->
								<button class="card hover: bg-surface-100 rounded-md overflow-hidden" on:click={selectFile(file)}>
									<header>
										<video class="bg-black/50 w-full aspect-square">
											<source src={`file://${videoBasePath}${file}`} type="video/mp4" />
											<track kind="captions" />
										</video>
									</header>
									<div class="p-4 space-y-4">
										<p>{file}</p>
									</div>
								</button>
								{/each}
							{/if}
						</div>
					</div>

					{:else if currentTile === 2}
						<h1 class="text-center"> settings </h1>
						<div class="mx-auto max-w-lg">
							<p>Choose image folder</p>
							<p>{imageBasePath}</p>
							<!-- TODO: Add all required settings and a way to push settings to the user config -->
							<button class="btn btn-primary" on:click={showfilepicker}>pick folder</button>
						</div>
					{/if}
		</AppShell>

	</Layout>
</main>

<style global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>