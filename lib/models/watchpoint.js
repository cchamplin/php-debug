'use babel'

export default class Watchpoint {
  constructor (data) {
    if (!data.expression)
      throw new Error("Invalid watchpoint")
    this.expression = data.expression.trim()
  }
  serialize () {
    return {
      deserializer: 'Watchpoint',
      version: Watchpoint.version,
      data: {
        expression: this.getExpression()
      }
    }
  }

  static deserialize (serialized) {
    const data = serialized.data;
    return new Watchpoint({expression: data.expression})
  }

  getPath() {
    return this.path
  }

  getExpression() {
    return this.expression
  }

  setValue (value) {
    this.value = value;
  }

  getValue () {
    return this.value
  }

  isLessThan (other) {
    if (!(other instanceof Watchpoint)) {
      return true
    }

    if (other.getExpression() < this.getExpression()) {
      return true;
    }
    return false;
  }

  isEqual (other) {
    if (!(other instanceof Watchpoint)) {
      return false
    }
    if (other.getExpression() != this.getExpression()) {
      return false
    }
    return true
  }

  isGreaterThan (other) {
    if (!(other instanceof Watchpoint)) {
      return false;
    }
    if (!this.isLessThan(other) && !this.isEqual(other)) {
      return true
    }
    return false;
  }
}
Watchpoint.version = '1b'
  atom.deserializers.add(Watchpoint)
