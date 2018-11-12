const {
  curry
} = require('./essentials')

// toString :: a -> String
const toString = String

// id :: a -> a
const id = x => x

// filter :: (a -> Boolean) -> [a] -> [a]
const filter = curry((fn, xs) => xs.filter(fn))

// eq :: Eq a => a -> a -> Boolean
const eq = curry((a, b) => a === b)

module.exports = {
  toString,
  id,
  filter,
  eq
}
