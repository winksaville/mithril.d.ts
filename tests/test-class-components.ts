import * as m from 'mithril'

///////////////////////////////////////////////////////////
// 0.
// Simplest component example - no attrs or state.
//
class Comp0 implements Mithril.ClassComponent<{}> {
	constructor (vnode: Mithril.CVnode<{}>) {
	}
	view() {
		return m('span', "Test")
	}
}

// Mount the component
m.mount(document.getElementById('comp0')!, Comp0)

// Unmount the component
m.mount(document.getElementById('comp0')!, null)

///////////////////////////////////////////////////////////
// 1.
// Simple example with lifecycle methods.
//
class Comp1 implements Mithril.ClassComponent<{}> {
	oninit (vnode: Mithril.CVnode<{}>) {
	}
	oncreate ({dom}: Mithril.CVnodeDOM<{}>) {
	}
	view (vnode: Mithril.CVnode<{}>) {
		return m('span', "Test")
	}
}

///////////////////////////////////////////////////////////
// 2.
// Component with attrs type
//
interface Comp2Attrs {
	title: string
	description: string
}

class Comp2 implements Mithril.ClassComponent<Comp2Attrs> {
	view ({attrs: {title, description}}: Mithril.CVnode<Comp2Attrs>) {
		return [m('h2', title), m('p', description)]
	}
}

///////////////////////////////////////////////////////////
// 3.
// Declares attrs type inline.
// Uses comp2 with typed attrs and makes use of `onremove`
// lifecycle method.
//
class Comp3 implements Mithril.ClassComponent<{pageHead: string}> {
	oncreate ({dom}: Mithril.CVnodeDOM<{pageHead: string}>) {
		// Can do stuff with dom
	}
	view ({attrs}: Mithril.CVnode<{pageHead: string}>) {
		return m('.page',
			m('h1', attrs.pageHead),
			m(Comp2,
				{
					// attrs is type checked - nice!
					title: "A Title",
					description: "Some descriptive text.",
					onremove: (vnode) => {
						// Vnode type is inferred
						console.log("comp2 was removed")
					},
				}
			),
			// Test other hyperscript parameter variations
			m(Comp1, m(Comp1)),
			m('br')
		)
	}
}

///////////////////////////////////////////////////////////
// 4.
// Typed attrs, component with state, methods
//
interface Comp4Attrs {
	name: string
}

class Comp4 implements Mithril.ClassComponent<Comp4Attrs> {
	count: number
	constructor (vnode: Mithril.CVnode<Comp4Attrs>) {
		this.count = 0
	}
	add (num: number) {
		this.count += num
	}
	view ({attrs}: Mithril.CVnode<Comp4Attrs>) {
		return [
			m('h1', `This ${attrs.name} has been clicked ${this.count} times`),
			m('button',
				{
					onclick: () => this.add(1)
				},
			"Click me")
		]
	}
}


///////////////////////////////////////////////////////////
//
// Concise module example with default export
//
export interface Attrs {
	name: string
}

export default class MyComponent implements Mithril.ClassComponent<Attrs> {
	count = 0
	view ({attrs}: Mithril.CVnode<Attrs>) {
		return m('span', `name: ${attrs.name}, count: ${this.count}`)
	}
}
