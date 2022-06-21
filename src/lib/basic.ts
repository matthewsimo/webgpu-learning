import vertTriangle from './shaders/vert.tri.wgsl?raw';
import fragRed from './shaders/frag.red.wgsl?raw';

export async function initWebGPU(canvas: HTMLCanvasElement) {
	if (!navigator.gpu) throw new Error('WebGPU unsupported');

	const adapter = await navigator.gpu.requestAdapter({
		powerPreference: 'high-performance'
	});

	if (!adapter) throw new Error('No Adapter Found');

	const adapterInfo = await adapter.requestAdapterInfo();
	const device = await adapter.requestDevice();
	const context = canvas.getContext('webgpu') as GPUCanvasContext;
	const format = navigator.gpu.getPreferredCanvasFormat();
	const devicePixelRatio = window.devicePixelRatio || 1;
	canvas.width = canvas.clientWidth * devicePixelRatio;
	canvas.height = canvas.clientHeight * devicePixelRatio;
	const size = { width: canvas.width, height: canvas.height };
	context.configure({
		device,
		format,
		alphaMode: 'opaque'
	});

	console.log({ adapter, adapterInfo, features: [...adapter.features.entries()] });
	return { device, context, format, size };
}

export async function createPipeline(
	device: GPUDevice,
	format: GPUTextureFormat
): Promise<GPURenderPipeline> {
	const descriptor: GPURenderPipelineDescriptor = {
		layout: 'auto',
		vertex: {
			module: device.createShaderModule({
				code: vertTriangle
			}),
			entryPoint: 'main'
		},
		primitive: {
			topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
		},
		fragment: {
			module: device.createShaderModule({
				code: fragRed
			}),
			entryPoint: 'main',
			targets: [
				{
					format: format
				}
			]
		}
	};
	return await device.createRenderPipelineAsync(descriptor);
}

export function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline) {
	const commandEncoder = device.createCommandEncoder();
	const view = context.getCurrentTexture().createView();
	const renderPassDescriptor: GPURenderPassDescriptor = {
		colorAttachments: [
			{
				view: view,
				clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
				loadOp: 'clear', // clear/load
				storeOp: 'store' // store/discard
			}
		]
	};
	const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
	passEncoder.setPipeline(pipeline);
	// 3 vertex form a triangle
	passEncoder.draw(3);
	passEncoder.end();
	// webgpu run in a separate process, all the commands will be executed after submit
	device.queue.submit([commandEncoder.finish()]);
}
