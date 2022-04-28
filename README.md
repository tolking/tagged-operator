# tagged-operator [alpha]

> Simulate operator overloading with [Tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates)

## Installation

```sh
npm i tagged-operator
```

## Usage

- simple to use

```js
import { createPipeTag } from 'tagged-operator'

const operator = (type, val1, val2) => {
  if (type === '~') {
    return (val1 + val2) * (val2 + 1 - val1) / 2
  }
}
const calc = createPipeTag({ operator })

console.log(calc`${1} ~ ${100}`) // 5050
console.log(calc`${23} ~ ${86}`) // 3488
```

- use by class, eg [Coordinate](./src/core/class.test.ts)

```js
const a = new Coordinate(100, 100)
const b = new Coordinate(0, 200)

// a * 3 - b
console.log(a.calc`${a} * ${3} - ${b}`) // Coordinate { x: 300, y: 100 }
```

- use with TypeScript

```ts
import { createTag, Precedence, Operator } from 'tagged-operator'

const precedence: Precedence = { 1: ['*', '/'] }
const operator: Operator<string | number, string> = (type, val1, val2) => {
  switch (type) {
    case '+':
      return String(val1) + String(val2)
    case '-':
      return String(val1).replace(String(val2), '')
    case '*':
      if (typeof val1 === 'number' && typeof val2 === 'string') {
        return val2.repeat(val1)
      } else {
        return String(val1).repeat(+val2)
      }
    case '/':
      return String(val1).replaceAll(String(val2), '')
    default:
      console.warn(`no operator configured: ${type}`)
      return String(val1)
  }
}
const calc = createTag({ operator, precedence })

console.log(calc`${'Hello'} + ${' World!'}`) // Hello World!
console.log(calc`${'Hello'} * ${3}`) // HelloHelloHello
console.log(calc`(${'Hello'} + ${' World!'}) / ${'l'} - ${'!'}`) // Heo Word
```

## config

### type

- Type: `default` | `precedence` | `pipe`
- Default: `default`

how to calculate (for the class `TaggedOperator`)

- `default` - the config operator precedence information and grouping operators `()`.
- `precedence` - just used the config operator precedence information.
- `pipe` - executes sequentially.

### operator

- Required: `true`
- Type: `Function(type, val1, val2)`

How the match operator is evaluated

- `type` - current operator (Note: prohibited to use `(` and `)` when use function `createTag`)
- `val1` - the value to the left of the current operator
- `val2` - the value to the right of the current operator

### precedence

- Type: `object`

Configure operator precedence information.

The larger the key, the higher the precedence. For performance reasons, you should only config operators that need to be evaluated first.

eg: 

```js
const precedence = {
  2: ['^'],
  1: ['*', '/'],
}
```

## Function

### TaggedOperator

Create a tagged calculator through class

### createTag

Create a tagged calculator that executes with precedence and grouping operators `()`.

### createPrecedenceTag

Create a tagged calculator that only includes precedence information, *without grouping operators `()`*

### createPipeTag

Create a tagged calculator that executes sequentially

## License

[MIT](http://opensource.org/licenses/MIT)
