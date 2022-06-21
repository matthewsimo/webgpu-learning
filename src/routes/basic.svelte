<script lang="ts">
	import { onMount } from 'svelte';
	import { initWebGPU, createPipeline, draw } from '$lib/basic';

	let canvas: HTMLCanvasElement;
	let error: { message: string; stack: string } | null;
	const run = async () => {
		const { device, context, format } = await initWebGPU(canvas);
		const pipeline = await createPipeline(device, format);
		// start draw
		draw(device, context, pipeline);

		// re-configure context on resize
		window.addEventListener('resize', () => {
			canvas.width = canvas.clientWidth * devicePixelRatio;
			canvas.height = canvas.clientHeight * devicePixelRatio;
			// don't need to recall context.configure() after v104
			draw(device, context, pipeline);
		});
	};

	onMount(async () => {
		console.log({ mount: true });
		try {
			await run();
		} catch (e: unknown) {
			console.log({ e });

			error = e as { message: string; stack: string };
		}
	});

	$: console.log({ canvas, error });
</script>

{#if error}
	<div class="w-full h-screen fixed z-20 bg-error p-20">
		<h2 class="text-center text-error-content text-3xl">{error.message}</h2>
		<pre class="w-full overflow-x-scroll">
  <code class="prose">
    {error.stack}
  </code>
</pre>
	</div>
{/if}
<canvas bind:this={canvas} class="w-full h-screen" />
