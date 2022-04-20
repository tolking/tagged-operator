# template-operator [demo]

> Simulate operator overloading with template strings

## Usage

check [Coordinate](./test/coordinate.ts)

```js
const a = new Coordinate(100, 100)
const b = new Coordinate(0, 200)

// a * 3 - b
console.log(a.calc`${a} * ${3} - ${b}`) // Coordinate { x: 300, y: 100 }
```

## License

[MIT](http://opensource.org/licenses/MIT)
