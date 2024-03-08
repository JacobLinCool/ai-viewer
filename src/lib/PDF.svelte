<script async lang="ts">
	import { onMount } from "svelte";
	import type { getDocument } from "pdfjs-dist";
	import { browser } from "$app/environment";

	if (browser) {
		window.pdfjsLib.GlobalWorkerOptions.workerSrc =
			"//esm.sh/pdfjs-dist/build/pdf.worker.min.js";
	}

	export let src: Parameters<typeof getDocument>[0];
	export let page = 1;
	export let scale = 1.5;

	$: data = browser ? window.pdfjsLib.getDocument(src).promise : null;

	let canvas: HTMLCanvasElement;
	let ready: HTMLElement;

	onMount(load);

	async function load() {
		const context = canvas.getContext("2d");
		if (!context) {
			throw new Error("Canvas 2D context not available");
		}

		const pdf = await data;
		if (!pdf) {
			return;
		}
		const target = await pdf.getPage(page);
		const viewport = target.getViewport({ scale });
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		await target.render({ canvasContext: context, viewport }).promise;
		ready.className = `page-${page}`;
	}
</script>

<div>
	<canvas bind:this={canvas}></canvas>
	{#await data then pdf}
		<div id="controls">
			<label>
				Page: <input
					id="page"
					type="number"
					min="1"
					max={pdf?.numPages}
					bind:value={page}
					on:change={load}
				/>
			</label>
			<label>
				Scale: <input
					id="scale"
					type="number"
					step="0.1"
					min="0.1"
					max="3"
					bind:value={scale}
					on:change={load}
				/>
			</label>
		</div>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
	<span id="ready" bind:this={ready}></span>
</div>

<style>
	canvas {
		display: block;
		margin: 0 auto;
	}

	#controls {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		opacity: 0;
		background: lightcoral;
		transition: opacity 0.3s;
		display: flex;
		justify-content: space-between;
		padding: 0.5em;
	}
	#controls:hover {
		opacity: 1;
	}

	#ready {
		display: none;
	}
</style>
