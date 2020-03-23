import { createStore } from "../../view/store";
import { render, h, Options } from "preact";
import { DevTools } from "../../view/components/Devtools";
import { createAdapter } from "../../adapter/adapter/adapter";
import { DevtoolsHook } from "../../adapter/hook";
import { applyEvent } from "../../adapter/events/events";
import { setupOptions } from "../../adapter/10/options";
import { Store } from "../../view/store/types";
import { Preact10Renderer } from "../../adapter/10/renderer";

export function attach(
	options: Options,
	rendererFn: (hook: DevtoolsHook) => Preact10Renderer,
) {
	const store = createStore();
	const fakeHook: DevtoolsHook = {
		attach: () => 1,
		attachPreact: () => 1,
		listen: () => null,
		connected: true,
		detach: () => null,
		emit: (name, data) => {
			applyEvent(store, name, data);
		},
		renderers: new Map(),
	};

	const renderer = rendererFn(fakeHook);
	const destroy = setupOptions(options as any, renderer);

	createAdapter(window, renderer);

	return {
		store,
		destroy,
	};
}

export type Container = Element | Document | ShadowRoot | DocumentFragment;
export function renderDevtools(store: Store, container: Container) {
	render(h(DevTools, { store }), container);
}
