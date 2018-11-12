const {
  Maybe,
  Container,
  Either,
  Left,
  IO
} = require('./algebraic-structures')

const {
  curry,
  compose,
  maybe,
  either
} = require('./essentials')

const {
  toString,
  id,
  filter,
  eq
} = require('./pointfree-utilities')

// ------------------ Pointfree Utilities -----------
const reduce = curry((fn, zero, xs) => xs.reduce(fn, zero));

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

// concat :: String -> String -> String
const concat = curry((s1, s2) => s1.concat(s2))

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

getTwenty({ balance: 10.00 })
// Nothing

// getThirty :: Account -> String
const getThirty = compose(maybe("You're broke!", finishTransaction), withdraw(30))

getThirty({ balance: 200 })
// Your balance is $170.00

getThirty({ balance: 20 })
// You're broke!


Either.of('rain').map(str => `b${str}`)
// Right('brain')

const left = x => new Left(x)
left('rain').map(str => `It's gonna ${str}, better bring your umbrella!`)
// Left('rain')

Either.of({ host: 'localhost', port: 80 }).map(prop('host'))
// Right('localhost')

left('roll eyes...').map(prop('host'))
// Left('roll eyes...')

const moment = require('moment')

// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now, user) => {
  const birthDate = moment(user.birthDate, 'YYYY-MM-DD')

  return birthDate.isValid()
    ? Either.of(now.diff(birthDate, 'years'))
    : left('Birth date could not be parsed')
})

getAge(moment(), { birthDate: '2005-12-12' })
// Right(9)

getAge(moment(), { birthDate: 'July 4, 2001' })
// Left('Birth date could not be parsed')

// fortune :: Number -> String
const fortune = compose(concat('If you survive, you will be '), toString, add(1))

// zoltar :: User -> Either(String, _)
const zoltar = compose(map(console.log), map(fortune), getAge(moment()))

zoltar({ birthDate: '2005-12-12' })
// 'If you survive, you will be 13'
// Right(undefined)

zoltar({ birthDate: 'ballons!' })
// Left('Birth date could not be parsed')

// zoltar2 :: User -> _
const zoltar2 = compose(console.log, either(id, fortune), getAge(moment()))

zoltar2({ birthDate: '2005-12-12' })
// If you survive, you will be 13
// undefined

zoltar2({ birthDate: 'balloons!' })
// 'Birth date could not be parsed'
// undefined


// window stub
const window = {
  innerWidth: 1430,
  location: {
    href: 'http://localhost:8000/blog/posts?searchTerm=wafflehouse&foo=bar'
  }
}

// ioWindow :: IO Window
const ioWindow = new IO(() => window)

// Note that, to simplfy reading, we'll show the hypothetical value contained
// in the `IO` as result; however in practice, you can't tell what this value is
// until you're actually unleashed the effects!

ioWindow.map(win => win.innerWidth)
// IO(1430)

ioWindow
  .map(prop('location'))
  .map(prop('href'))
  .map(split('/'))
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])

// document stub
const document = {
  querySelectorAll: (selector) => {
    return [
      {
        innerHTML: "I am some inner html"
      }
    ]
  }
}

// $ :: String -> IO [DOM]
const $ = selector => new IO(() => document.querySelectorAll(selector))

$("#myDiv").map(head).map(div => div.innerHTML)
// IO("I am some inner html")

// url :: IO String
const url = new IO(() => window.location.href)

// toPairs :: String -> [[String]]
const toPairs = compose(map(split('=')), split('&'))

// params :: String -> [[String]]
const params = compose(toPairs, last, split('?'))

// findParam :: String -> IO Maybe [String]
const findParam = key => map(compose(Maybe.of, filter(compose(eq(key), head)), params), url)

// -- Impure calling code ----------------------------------------------

// run it by calling $value()!
findParam('searchTerm').unsafePerformIO()
// Just([['searchTerm', 'wafflehouse']])
