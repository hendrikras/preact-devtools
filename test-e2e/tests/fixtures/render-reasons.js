const { h, render, Component } = preact;
const { useMemo, useState } = preactHooks;

function Display(props) {
	return html`
		<div data-testid="${props.testid}">Counter: ${props.value}</div>
	`;
}

function Memoed() {
	return html`<div data-testid="memoed">Memoed</div>`;
}

function MemoParent() {
	return useMemo(() => h(Memoed), []);
}

class ComponentState extends Component {
	state = { value: 0 };

	render() {
		const v = this.state.value;
		return html`
			<div style="padding: 2rem;">
				<${Display} value=${v} testid="result-1" />
				<${MemoParent} />
				<button
					data-testid="counter-1"
					onClick=${() => this.setState({ value: v + 1 })}
				>
					Increment class state
				</button>
			</div>
		`;
	}
}

function HookState() {
	const [v, set] = useState(0);

	return html`
		<div style="padding: 2rem;">
			<${Display} value=${v} testid="result-2" />
			<${MemoParent} />
			<button data-testid="counter-2" onClick=${() => set(v + 1)}>
				Increment hook state
			</button>
		</div>
	`;
}

class ForceUpdate extends Component {
	render() {
		return html`
			<div style="padding: 2rem;">
				<${MemoParent} />
				<button data-testid="force-update" onClick=${() => this.forceUpdate()}>
					Force Update
				</button>
			</div>
		`;
	}
}

class ComponentMultiState extends Component {
	state = { counter: 0, other: 0 };

	render() {
		const v = this.state.counter;
		return html`
			<div style="padding: 2rem;">
				<${Display} value=${v} />
				<${MemoParent} />
				<button
					data-testid="class-state-multi"
					onClick=${() => this.setState({ counter: v + 1, other: v + 2 })}
				>
					Increment multi class state
				</button>
			</div>
		`;
	}
}

render(
	html`
		<${ComponentState} />
		<${HookState} />
		<${ForceUpdate} />
		<${ComponentMultiState} />
	`,
	document.getElementById("app"),
);
