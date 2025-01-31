var classOnly = /^\.([\w\-]+)$/;
var nodeType = 'nodeType';
var isAncestor = 'compareDocumentPosition' in window.document.documentElement ?
  function (element, container) {
    return (container.compareDocumentPosition(element) & 16) == 16
  } :
  function (element, container) {
    container = container == window.document || container == window ? window.document.documentElement : container
    return container !== element && container.contains(element)
  }

function toArray(ar) {
  return [].slice.call(ar, 0)
}

function isNode(el) {
  var t
  return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9)
}

function arrayLike(o) {
  return (typeof o === 'object' && isFinite(o.length))
}

function flatten(ar) {
  for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
  return r
}

function uniq(ar) {
  var a = [], i, j
  label:
  for (i = 0; i < ar.length; i++) {
    for (j = 0; j < a.length; j++) {
      if (a[j] == ar[i]) {
        continue label
      }
    }
    a[a.length] = ar[i]
  }
  return a
}


function normalizeRoot(root) {
  if (!root) return window.document
  if (typeof root == 'string') return qwery(root)[0]
  if (!root[nodeType] && arrayLike(root)) return root[0]
  return root
}

/**
 * @param {string|Array.<Element>|Element|Node} selector
 * @param {string|Array.<Element>|Element|Node=} opt_root
 * @return {Array.<Element>}
 */
function qwery(selector, opt_root) {
  var m, root = normalizeRoot(opt_root)
  if (!root || !selector) return []
  if (selector === window || isNode(selector)) {
    return !opt_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
  }
  if (selector && arrayLike(selector)) return flatten(selector)


  if (window.document.getElementsByClassName && selector == 'string' && (m = selector.match(classOnly))) {
    return toArray((root).getElementsByClassName(m[1]))
  }
  // using duck typing for 'a' window or 'a' document (not 'the' window || document)
  if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
    return !opt_root ? [selector] : []
  }
  return toArray((root).querySelectorAll(selector))
}

qwery.uniq = uniq

module.exports = qwery;
