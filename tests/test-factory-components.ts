import * as m from 'mithril'

///////////////////////////////////////////////////////////
// 0.
// Simplest component example - no attrs or state.
//
function comp0() {
	return {
		view() {
			return m('span', "Test")
		}
	}
}

// Mount the component
m.mount(document.getElementById('comp0')!, comp0)

// Unmount the component
m.mount(document.getElementById('comp0')!, null)

///////////////////////////////////////////////////////////
// 1.
// Simple example. Vnode type for component methods is inferred.
//
function comp1() {
	return {
		oncreate ({dom}) {
			// vnode.dom type inferred
		},
		view (vnode) {
			return m('span', "Test")
		}
	} as Mithril.Component<{},{}>
}

///////////////////////////////////////////////////////////
// 2.
// Component with attrs type. Different type annotation
// style to infer factory vnode type.
//
interface Comp2Attrs {
	title: string
	description: string
}

const comp2 = function (vnode) { // vnode is inferred
	return {
		view ({attrs: {title, description}}) { // Comp2Attrs type is inferred
			return [m('h2', title), m('p', description)]
		}
	}
} as Mithril.FactoryComponent<Comp2Attrs,{}>

///////////////////////////////////////////////////////////
// 3.
// Declares attrs type inline.
// Uses comp2 with typed attrs and makes use of `onremove`
// lifecycle method.
//
const comp3 = function() {
	return {
		oncreate ({dom}) {
			// Can do stuff with dom
		},
		view ({attrs}) {
			return m('.page',
				m('h1', attrs.pageHead),
				m(comp2,
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
				m(comp1, m(comp1)),
				m('br')
			)
		}
	}
} as Mithril.FactoryComponent<{pageHead: string},{}>

///////////////////////////////////////////////////////////
// 4.
// Stateful component using closure method & var
// to hold state.
//
interface Comp4Attrs {
	name: string
}

const comp4 = function() {
	let count = 0

	function add (num: number) {
		count += num
	}

	return {
		oninit() {
			count = 0
		},
		view ({attrs}) {
			return [
				m('h1', `This ${attrs.name} has been clicked ${count} times`),
				m('button',
					{
						// 'this' is typed!
						onclick: () => add(1)
					},
				"Click me")
			]
		}
	}
} as Mithril.FactoryComponent<Comp4Attrs,{}>

///////////////////////////////////////////////////////////
// 5.
// Stateful component (Equivalent to Comp4 example.)
// Uses vnode.state instead of closure.
//
interface Comp5State {
	count: number
	add (num: number): void
}

const comp5 = function() {
	return {
		oninit ({state}) {
			state.count = 0
			state.add = num => {state.count += num}
		},
		view ({attrs, state}) {
			return [
				m('h1', `This ${attrs.name} has been clicked ${state.count} times`),
				m('button',
					{
						onclick: () => {state.add(1)}
					},
					"Click me"
				)
			]
		}
	}
} as Mithril.FactoryComponent<Comp4Attrs,Comp5State>


///////////////////////////////////////////////////////////
//
// Concise module example with default export
//
interface Attrs {
	name: string
}

interface State {
	count: number
}

export default (function() {
	let count = 0
	return {
		view ({attrs}) {
			return m('span', `name: ${attrs.name}, count: ${count}`)
		}
	}
}) as Mithril.FactoryComponent<Attrs,State>
