<script lang="ts">
	import "../app.css";
	import { PDF } from "$lib";

	let files: FileList | null = null;
	let buffer: ArrayBuffer | null = null;
	let page = 1;
	let scale = 1.5;

	async function view() {
		if (files?.length) {
			const file = files[0];
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				if (reader.result instanceof ArrayBuffer) {
					buffer = reader.result;
				}
			});
			reader.readAsArrayBuffer(file);
		}
	}
</script>

<svelte:head>
	<title>AI Viewer</title>
</svelte:head>

{#if !buffer}
	<main>
		<h1>AI Viewer</h1>
		<p>An Intelligent Adobe Illustrator File Viewer.</p>
		<label>
			<input type="file" accept=".pdf,.ai" bind:files on:change={view} />
			<div class="select">Select File</div>
		</label>
	</main>
{:else}
	<PDF src={buffer} {page} {scale} />
{/if}

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 20em;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
	}
	p {
		color: #333;
	}
	input[type="file"] {
		display: none;
	}
	.select {
		background-color: #ff3e00;
		color: white;
		padding: 0.5em 1em;
		border: none;
		border-radius: 0.5em;
		cursor: pointer;
		transition: background-color 0.3s;
		font-size: 1.5em;
	}
	.select:hover {
		background-color: #ff5f3d;
	}
</style>
