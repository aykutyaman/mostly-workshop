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

// join :: Monad m => m (m a) -> m a
const join = m => m.join()

// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((fn, m) => m.chain(fn));

module.exports = {
  toString,
  id,
  filter,
  eq,
  join,
  chain
}
