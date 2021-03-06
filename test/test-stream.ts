import * as stream from '../stream'
import {Stream} from '../stream'

{
	const s = stream(1)
	const initialValue = s()
	s(2)
	const newValue = s()
	console.assert(initialValue === 1)
	console.assert(newValue === 2)
}

{
	const s = stream()
	console.assert(s() === undefined)
}

{
	const s: Stream<number | undefined> = stream(1)
	s(undefined)
	console.assert(s() === undefined)
}

{
	const s = stream(stream(1))
	console.assert(s()() === 1)
}

{
	const s = stream()
	const doubled = stream.combine(function(s) {return s() * 2}, [s])
	s(2)
	console.assert(doubled() === 4)
}

{
	const s = stream(2)
	const doubled = stream.combine(function(s) {return s() * 2}, [s])
	console.assert(doubled() === 4)
}

{
	const s1 = stream()
	const s2 = stream()
	const added = stream.combine(function(s1, s2) {return s1() + s2()}, [s1, s2])
	s1(2)
	s2(3)
	console.assert(added() === 5)
}

{
	const s1 = stream(2)
	const s2 = stream(3)
	const added = stream.combine(function(s1, s2) {return s1() + s2()}, [s1, s2])
	console.assert(added() === 5)
}

{
	const s1 = stream(2)
	const s2 = stream()
	const added = stream.combine(function(s1, s2) {return s1() + s2()}, [s1, s2])
	s2(3)
	console.assert(added() === 5)
}

{
	let count = 0
	const a = stream()
	const b = stream.combine(function(a) {return a() * 2}, [a])
	const c = stream.combine(function(a) {return a() * a()}, [a])
	const d = stream.combine(function(b, c) {
		count++
		return b() + c()
	}, [b, c])
	a(3)
	console.assert(d() === 15)
	console.assert(count === 1)
}

{
	let count = 0
	const a = stream(3)
	const b = stream.combine(function(a) {return a() * 2}, [a])
	const c = stream.combine(function(a) {return a() * a()}, [a])
	const d = stream.combine(function(b, c) {
		count++
		return b() + c()
	}, [b, c])
	console.assert(d() === 15)
	console.assert(count === 1)
}

{
	let streams: Stream<any>[] = []
	const a = stream()
	const b = stream()
	const c = stream.combine(function(a, b, changed) {
		streams = changed
	}, [a, b])
	a(3)
	b(5)
	console.assert(streams.length === 1)
	console.assert(streams[0] === b)
}

{
	let streams: Stream<number>[] = []
	const a = stream(3)
	const b = stream(5)
	const c = stream.combine(function(a, b, changed) {
		streams = changed
	}, [a, b])
	a(7)
	console.assert(streams.length === 1)
	console.assert(streams[0] === a)
}

{
	const a = stream(1)
	const b = stream.combine(function(a) {
		return undefined
	}, [a])

	console.assert(b() === undefined)
}

{
	const a = stream(1)
	const b = stream.combine(function(a) {
		return stream(2)
	}, [a])
	console.assert(b()() === 2)
}

{
	const a = stream(1)
	const b = stream.combine(function(a) {
		return stream()
	}, [a])
	console.assert(b()() === undefined)
}

{
	let count = 0
	const a = stream(1)
	const b = stream.combine(function(a) {
		return stream.HALT
	}, [a])
	["fantasy-land/map"](function() {
		count++
		return 1
	})
	console.assert(b() === undefined)
}

{
	const all = stream.merge([
		stream(10),
		stream("20"),
		stream({value: 30}),
	])
}

{
	const straggler = stream()
	const all = stream.merge([
		stream(10),
		stream("20"),
		straggler,
	])
	console.assert(all() === undefined)
	straggler(30)
}

{
	let value = 0
	const id = function(value: number) {return value}
	const a = stream<number>()
	const b = stream<number>()

	const all = stream.merge([a.map(id), b.map(id)]).map(function(data) {
		value = data[0] + data[1]
	})

	a(1)
	b(2)
	console.assert(value === 3)

	a(3)
	b(4)
	console.assert(value === 7)
}

{
	const s = stream()
	const doubled = stream.combine(function(stream) {return stream() * 2}, [s])
	s.end(true)
	s(3)
	console.assert(doubled() === undefined)
}

{
	const s = stream(2)
	const doubled = stream.combine(function(stream) {return stream() * 2}, [s])
	s.end(true)
	s(3)
	console.assert(doubled() === 4)
}

{
	const s = stream(2)
	s.end(true)
	const doubled = stream.combine(function(stream) {return stream() * 2}, [s])
	s(3)
	console.assert(doubled() === undefined)
}

{
	const s = stream(2)
	const doubled = stream.combine(function(stream) {return stream() * 2}, [s])
	doubled.end(true)
	s(4)
	console.assert(doubled() === 4)
}

{
	const s = stream<number>()
	const doubled = s["fantasy-land/map"](function(value: number) {return value * 2})
	s(3)
	console.assert(doubled() === 6)
}

{
	const s = stream(3)
	const doubled = s["fantasy-land/map"](function(value: number) {return value * 2})
	console.assert(doubled() === 6)
}

{
	const s = stream<undefined>()
	const mapped = s["fantasy-land/map"](function(value: undefined) {return String(value)})
	s(undefined)
	console.assert(mapped() === "undefined")
}

{
	const s = stream(undefined)
	const mapped = s["fantasy-land/map"](function(value: undefined) {return String(value)})
	console.assert(mapped() === "undefined")
}

{
	const s = stream(undefined)
	const mapped = s["fantasy-land/map"](function(value: undefined) {return stream()})
	console.assert(mapped()() === undefined)
}

{
	const s = stream(undefined)
	console.assert(s["fantasy-land/map"] === s.map)
}

{
	const apply = stream(function(value: number) {return value * 2})
	const s = stream(3)
	const applied = s["fantasy-land/ap"](apply)
	console.assert(applied() === 6)
	apply(function(value) {return value / 3})
	console.assert(applied() === 1)
	s(9)
	console.assert(applied() === 3)
}

{
	const apply = stream(function(value: undefined) {return String(value)})
	const s = stream(undefined)
	const applied = s["fantasy-land/ap"](apply)
	console.assert(applied() === "undefined")
	apply(function(value) {return String(value) + "a"})
	console.assert(applied() === "undefineda")
}

{
	const s = stream(3)
	const mapped = s["fantasy-land/map"](function(value: number) {return value})
	console.assert(s() === mapped())
}

{
	const f = function f(x: number) {return x * 2}
	const g = function g(x: number) {return x * x}
	const s = stream(3)
	const mapped = s["fantasy-land/map"](function(value: any) {return f(g(value))})
	const composed = s["fantasy-land/map"](g)["fantasy-land/map"](f)
	console.assert(mapped() === 18)
	console.assert(mapped() === composed())
}

{
	const a = stream(function(value: number) {return value * 2})
	const u = stream(function(value: number) {return value * 3})
	const v = stream(5)
	const mapped = v["fantasy-land/ap"](u["fantasy-land/ap"](a["fantasy-land/map"](function(f: any) {
		return function(g: any) {
			return function(x: any) {
				return f(g(x))
			}
		}
	})))
	const composed = v["fantasy-land/ap"](u)["fantasy-land/ap"](a)
	console.assert(mapped() === 30)
	console.assert(mapped() === composed())
}

{
	const a = stream()["fantasy-land/of"](function(value: number) {return value})
	const v = stream(5)
	console.assert(v["fantasy-land/ap"](a)() === 5)
	console.assert(v["fantasy-land/ap"](a)() === v())
}

{
	const a = stream(0)
	const f = function(value: number) {return value * 2}
	const x = 3
	console.assert(a["fantasy-land/of"](x)["fantasy-land/ap"](a["fantasy-land/of"](f))() === 6)
	console.assert(a["fantasy-land/of"](x)["fantasy-land/ap"](a["fantasy-land/of"](f))() === a["fantasy-land/of"](f(x))())
}

{
	const u = stream(function(value: number) {return value * 2})
	const a = stream()
	const y = 3
	console.assert(a["fantasy-land/of"](y)["fantasy-land/ap"](u)() === 6)
	console.assert(a["fantasy-land/of"](y)["fantasy-land/ap"](u)() === u["fantasy-land/ap"](a["fantasy-land/of"](function(f: any) {return f(y)}))())
}

// scan

{
	const parent = stream<number>()
	const child = stream.scan((out, p) => out - p, 123, parent)
}

{
	const parent = stream<number>()
	const child = stream.scan((arr, p) => arr.concat(p), [] as number[], parent)
	parent(7)
}

// scanMerge

{
	const parent1 = stream<number>()
	const parent2 = stream<number>()

	const child = stream.scanMerge([
		[parent1, (out, p1) => out + p1],
		[parent2, (out, p2) => out + p2]
	], -10)
}

{
	const parent1 = stream<string>()
	const parent2 = stream<string>()

	const child = stream.scanMerge([
		[parent1, (out, p1) => out + p1],
		[parent2, (out, p2) => out + p2 + p2]
	], "a")

	parent1("b")
	parent2("c")
	parent1("b")

	console.assert(child() === 'abccb')
}

{
	const parent1 = stream<string>()
	const parent2 = stream<number>()
	const child = stream.scanMerge([
		[parent1, (out, p1) => out + p1],
		[parent2, (out, p2) => out + p2 + p2]
	], "a")

	parent1("a")
	parent2(1)

	console.assert(child() === 'aa11')
}
