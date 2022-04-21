# template-operator [demo]

> Simulate operator overloading with template strings

## Usage

- simple to use

```js
const operator = (type, val1, val2) => {
  if (type === '~') {
    return (val1 + val2) * (val2 + 1 - val1) / 2
  }
}
const calc = createCalc({ operator })

console.log(calc`${1} ~ ${100}`) // 5050
console.log(calc`${23} ~ ${86}`) // 3488
```

- use by class, eg [Coordinate](./test/coordinate.ts)

```js
const a = new Coordinate(100, 100)
const b = new Coordinate(0, 200)

// a * 3 - b
console.log(a.calc`${a} * ${3} - ${b}`) // Coordinate { x: 300, y: 100 }
```

## License

[MIT](http://opensource.org/licenses/MIT)
