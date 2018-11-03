const {
  Maybe,
  Container
} = require('./algebraic-structures')

// ------------------ Pointfree Utilities -----------
const curry = (fn) => {
  const arity = fn.length;
  return function $curry(...args) {
    if (args.length < fn.length) {
      return $curry.bind(null, ...args);
    }
    return fn.call(null, ...args);
  };
};
const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));

const reducer = (acc, fn) => [fn.call(null, ...acc)]

const compose = (...fns) => (...args) => fns.reduceRight(reducer, args)[0];

const toUpperCase = x => x.toUpperCase()

const exclaim = x => `${x}!`

// head :: [a] -> a
const head = xs => xs[0]

// safeHead :: [a] -> Maybe(a)
const safeHead = xs => Maybe.of(xs[0]) // TODO: move from here

const reverse = reduce((acc, x) => [x].concat(acc), [])

const last = compose(head, reverse)

const split = curry((pattern, str) => str.split(pattern))

// map :: Functor f -> (a -> b) -> f a -> f b
const map = curry((fn, f) => f.map(fn))

const join = curry((pattern, xs) => xs.join(pattern))

const concat = curry((s1, s2) => s2.concat(s1))

// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p])

const trace = curry((tag, x) => console.log(tag, x) || x)

// match :: RegExp -> String -> Boolean
const match = curry((p, str) => p.test(str))

// add :: Number -> Number -> Number
const add = curry((a, b) => a + b)

// -------------------------------------------------
const arg = ['jumpkick', 'roundhouse', 'uppercut']
const lastUpper = compose(toUpperCase, head, reverse)
const loudLastUpper = compose(exclaim, lastUpper)

lastUpper(arg) // UPPERCUT
loudLastUpper(arg) // UPPERCUT!

const toLowerCase = x => x.toLowerCase()
const replace = curry((re, rpl, str) => str.replace(re, rpl))
const snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase)

snakeCase("Hello World") // "hello_world"

const initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '))

initials('hunter stockton thompson') // 'H. S. T.'

const angry = compose(toUpperCase, exclaim)
const latin = compose(map(angry), reverse)
latin(['frog', 'eyes']) // ['EYES!', 'FROG!']

const dasherize = compose(
  join('-'),
  map(toLowerCase),
  split(' '),
  replace(/\s{2,}/ig, ' ')
)
dasherize('The    world is vampire')


// -------------------------- Chapter 08 -------------------------------

Container.of(2).map(x => x + 2)
// Container(4)

Container.of('hello').map(s => `${s} world`)
// Container('Hello World')

Container.of('bombs').map(concat(' away')).map(prop('length'))
// Container(10)

Maybe.of('Malkovic Malkovic').map(match(/a/gi))
// Just(true)

Maybe.of(null).map(match(/z/ig))
// Nothing

Maybe.of({ name: "boris" }).map(prop('age')).map(add(10))
// Nothing

Maybe.of({ name: "boris", age: 36 }).map(prop('age')).map(add(10))
// Just(46)

// streetName :: Object -> Maybe String
const streetName = compose(map(prop('street')), safeHead, prop('addresses'))

// map :: Functor f -> (a -> b) -> f a -> f b
// const map = curry((fn, f) => f.map(fn))

streetName({ addresses: [] })
// Nothing

streetName({ addresses: [{ street: 'Shady Ln. ', no: 4201 }] })
//  Just('Shady Ln.')

// withdraw :: Number -> Account -> Maybe(Account)
const withdraw = curry((amount, { balance }) =>
  Maybe.of(balance >= amount ? { balance: balance - amount } : null))

// This function is hypothetical, not implemented here... nor anywhere else
// updateLedger :: Account -> Account
const updateLedger = account => account

// remainingBalance :: Account -> String
const remainingBalance = ({ balance }) => `Your balance is $${balance}`

// finishTransaction :: Account -> String
const finishTransaction = compose(remainingBalance, updateLedger)

// getTwenty :: Account -> Maybe(String)
const getTwenty = compose(map(finishTransaction), withdraw(20))

getTwenty({ balance: 200.00 })
// Just('Your balance is $180')

// Releasing the value
// ...
