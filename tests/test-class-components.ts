import * as m from 'mithril'

///////////////////////////////////////////////////////////
// 0.
// Simplest component example - no attrs or state.
//
class Comp0 {
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
// Simple example. Vnode type for component methods is inferred.
//
class Comp1 implements Mithril.ClassComponent<{}> {
	oncreate ({dom}: Mithril.CVnodeDOM<{}>) {
	}
	view (vnode: Mithril.CVnodeDOM<{}>) {
		return m('span', "Test")
	}
}

///////////////////////////////////////////////////////////
// 2.
// Component with attrs
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
// Typed attrs and state, and `this` type is inferred.
//
interface Comp4Attrs {
	name: string
}

class Comp4 implements Mithril.ClassComponent<Comp4Attrs> {
	count: number // <- Must be declared to satisfy Comp4 type which includes Comp4State type
	constructor (vnode: Mithril.CVnode<Comp4Attrs>) {
		this.count = 0
	}
	add (num: number) {
		// num and this types inferred
		this.count += num
	}
	view ({attrs}: Mithril.CVnode<Comp4Attrs>) {
		return [
			m('h1', `This ${attrs.name} has been clicked ${this.count} times`),
			m('button',
				{
					// 'this' is typed!
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
interface Attrs {
	name: string
}

export default class MyComponent implements Mithril.ClassComponent<Attrs> {
	count = 0
	view ({attrs}: Mithril.CVnode<Attrs>) {
		return m('span', `name: ${attrs.name}, count: ${this.count}`)
	}
}
