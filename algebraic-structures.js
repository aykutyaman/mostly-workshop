const { inspect } = require('./essentials')

class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined
  }

  constructor(x) {
    this.$value = x
  }

  map(f) {
    return this.isNothing ? this : Maybe.of(f(this.$value))
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`
  }
}

class Container {
  constructor(x) {
    this.$value = x
  }
  static of(x) {
    return new Container(x)
  }
}
// (a -> b) -> Container a -> Container b
Container.prototype.map = function(f) {
  return Container.of(f(this.$value))
}

module.exports = {
  Maybe,
  Container
}
