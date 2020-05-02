
const helpers = {
  ifEquals : function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },
  minus : function(a, b) {
    return  a - b
  },
  add : function(a, b) {
    return  Number(a) + Number(b)
  }
}

module.exports = helpers
