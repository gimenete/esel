var util = require('util')

var esel = module.exports = function(options) {

  var obj = {}
  var ancestors = [{}]
  var ancestorTypes = ['_']

  function copy(name, options, args, object) {
    var n = 0
    ;(options.keys || [name]).forEach(function(key) {
      var i = n++
      var value = args[i]
      var type = options.types && options.types[i]
      if (type && typeof value !== type) {
        throw new Error(util.format('Method %s(%s) called with %s(%s)',
          name,
          options.types.join(', '),
          name,
          Array.prototype.slice.call(args).map(function(val) { return typeof val }).join(', ')
        ))
      }
      object[key] = value
    })
    Object.keys(options.implicits || {}).forEach(function(key) {
      object[key] = options.implicits[key]
    })
    return object
  }

  function findFirstAncestorAccepting(name) {
    for (var i=ancestors.length-1; i>=0; i--) {
      var type = ancestorTypes[i]
      if (!options[type]) {
        console.log('no', type)
      }
      if (options[type].children && options[type].children.indexOf(name) >= 0) {
        ancestors.splice(i+1)
        ancestorTypes.splice(i+1)
        return ancestors[i]
      }
    }
    throw new Error(util.format('Invalid chaining: %s', ancestorTypes.concat(name).join('.()')))
  }

  function add(name, options) {
    obj[name] = function() {
      var node = findFirstAncestorAccepting(name)
      if (options.multiple || options.nest) {
        var child = copy(name, options, arguments, {})
        if (options.multiple) {
          var arr = node[name]
          if (!arr) {
            arr = node[name] = []
          }
          arr.push(child)
        } else {
          node[name] = child
        }
      } else {
        var child = node
        copy(name, options, arguments, node)
      }
      ancestors.push(child)
      ancestorTypes.push(name)
      return obj
    }
  }

  Object.keys(options).forEach(function(name) {
    add(name, options[name])
  })

  obj.build = function() {
    return ancestors[0]
  }

  obj.up = function() {
    node = ancestors.splice(ancestors.length - 1)[0]
    ancestorTypes.splice(ancestorTypes.length - 1)
    return obj
  }

  return obj
}
