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

class Either {
  static of(x) {
    return new Right(x)
  }

  constructor(x) {
    this.$value = x
  }
}

class Left extends Either {
  map(f) {
    return this;
  }

  inspect() {
    return `Left(${inspect(this.$value)})`
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.$value))
  }

  inspect() {
    return `Right(${inspect(this.$value)})`
  }
}

module.exports = {
  Maybe,
  Container,
  Either,
  Left
}
