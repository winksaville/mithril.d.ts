# Typescript Definitions for [Mithril 1.0](https://github.com/lhorie/mithril.js)

## Install

Types are included with Mithril 1.0, so simply install mithril.js:

	npm install -S mithril.js

---

### The Gist:

#### POJO component example:

```typescript
import * as m from 'mithril'

export interface Attrs {
	name: string
}

interface State {
	count: number
}

export default {
	count: 0,
	view ({attrs}) {
		return m('span', `name: ${attrs.name}, count: ${this.count}`)
	}
} as Mithril.Component<Attrs,State> & State
```

#### ClassComponent example:

```typescript
import * as m from 'mithril'

export interface Attrs {
	name: string
}

export default class MyComponent implements Mithril.ClassComponent<Attrs> {
	count = 0
	// Note that class methods cannot infer parameter types
	view ({attrs}: Mithril.CVnode<Attrs>) {
		return m('span', `name: ${attrs.name}, count: ${this.count}`)
	}
}
```

#### FactoryComponent example

```typescript
import * as m from 'mithril'

export interface Attrs {
	name: string
}

export default export default (): Mithril.Component<Attrs,{}> => {
	let count = 0
	view ({attrs}) {
		return m('span', `name: ${attrs.name}, count: ${count}`)
	}
}
```

For more example usage see the `tests` folder.

*Note that tests are not intended to run as-is, only that they compile without errors.

To compile the tests:

	npm install
	npm test

---

Pull requests and issues are welcome.
