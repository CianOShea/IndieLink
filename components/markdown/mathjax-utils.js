// Some magic for deferring mathematical expressions to MathJax
// by hiding them from the Markdown parser.
// Some of the code here is adapted with permission from Davide Cervone
// under the terms of the Apache2 license governing the MathJax project.
// Other minor modifications are also due to StackExchange and are used with
// permission.

// MATHSPLIT contains the pattern for math delimiters and special symbols
// needed for searching for math in the text input.
const MATHSPLIT = /(\$\$?|\\(?:begin|end)\{[a-z]*\*?\}|\\[{}$]|[{}]|(?:\n\s*)+|@@\d+@@|\\\\(?:\(|\)|\[|\]))/i;

// The math is in blocks i through j, so
// collect it into one block and clear the others.
// Replace &, <, and > by named entities.
// For IE, put <br> at the ends of comments since IE removes \n.
// Clear the current math positions and store the index of the
// math, then push the math string onto the storage array.
// The preProcess function is called on all blocks if it has been passed in
const processMath = (i, j, preProcess, math, blocks) => {
  let block = blocks.slice(i, j + 1).join("").replace(/&/g, "&amp;") // use HTML entity for &
  .replace(/</g, "&lt;") // use HTML entity for <
  .replace(/>/g, "&gt;") // use HTML entity for >
  ;

  while (j > i) {
    blocks[j] = "" // eslint-disable-line
    j -= 1 //eslint-disable-line
  }

  blocks[i] = `@@${math.length}@@` // replace the current block text with a unique tag to find later

  if (preProcess) {
    block = preProcess(block)
  }
  math.push(block)
  return blocks
}

// Break up the text into its component parts and search
// through them for math delimiters, braces, linebreaks, etc.
// Math delimiters must match and braces must balance.
// Don't allow math to pass through a double linebreak
// (which will be a paragraph).
export const removeMath = (text) => {
  const math = [] // stores math strings for later
  let start
  let end
  let last
  let braces

  // Except for extreme edge cases, this should catch precisely those pieces of the markdown
  // source that will later be turned into code spans. While MathJax will not TeXify code spans,
  // we still have to consider them at this point; the following issue has happened several times:
  // `$foo` and `$bar` are letibales.  -->  <code>$foo ` and `$bar</code> are letiables.

  const hasCodeSpans = /`/.test(text)
  let deTilde
  if (hasCodeSpans) {
    const tilde = (wholematch) => wholematch.replace(/\$/g, "~D")
    text = text.replace(/~/g, "~T")
       .replace(/(^|[^\\])(`+)([^\n]*?[^`\n])\2(?!`)/gm, tilde)
       .replace(/^\s{0,3}(`{3,})(.|\n)*?\1/gm, tilde)

    deTilde = (_text) =>
      _text.replace(/~([TD])/g, (wholematch, character) => {
        return { T: "~", D: "$" }[character]
      })
  } else {
    deTilde = _text => _text
  }

  let blocks = regexSplit(text.replace(/\r\n?/g, "\n"), MATHSPLIT)

  for (let i = 1, m = blocks.length; i < m; i += 2) {
    const block = blocks[i]
    if (block.charAt(0) === "@") {
      // Things that look like our math markers will get
      // stored and then retrieved along with the math.
      blocks[i] = `@@${math.length}@@`
      math.push(block)
    } else if (start) {
      // If we are in math, look for the end delimiter,
      // but don't go past double line breaks, and
      // and balance braces within the math.
      if (block === end) {
        if (braces) {
          last = i
        } else {
          blocks = processMath(start, i, deTilde, math, blocks)
          start = null
          end = null
          last = null
        }
      } else if (block.match(/\n.*\n/)) {
        if (last) {
          i = last
          blocks = processMath(start, i, deTilde, math, blocks)
        }
        start = null
        end = null
        last = null
        braces = 0
      } else if (block === "{") {
        braces += 1
      } else if (block === "}" && braces) {
        braces += 1
      }
    } else {
      // Look for math start delimiters and when
      // found, set up the end delimiter.
      if (block === "$" || block === "$$") {
        start = i
        end = block
        braces = 0
      } else if (block === "\\\\\(" || block === "\\\\\[") {
        start = i
        end = block.slice(-1) === "(" ? "\\\\\)" : "\\\\\]"
        braces = 0
      } else if (block.substr(1, 5) === "begin") {
        start = i
        end = `\\end${block.substr(6)}`
        braces = 0
      }
    }
  }

  if (last) {
    blocks = processMath(start, last, deTilde, math, blocks)
    start = null
    end = null
    last = null
  }
  return [deTilde(blocks.join("")), math]
}


// Put back the math strings that were saved,
// and clear the math array (no need to keep it around).
export const replaceMath = (text, math) => {
  // Replaces a math placeholder with its corresponding group.
  // The math delimiters "\\(", "\\[", "\\)" and "\\]" are replaced
  // removing one backslash in order to be interpreted correctly by MathJax.
  const mathGroupProcess = (match, n) => {
    let mathGroup = math[n]

    if (
      mathGroup.substr(0, 3) === "\\\\\(" &&
      mathGroup.substr(mathGroup.length - 3) === "\\\\\)"
    ) {
      // mathGroup = `\\\(${mathGroup.substring(3, mathGroup.length - 3)}\\\)`
      mathGroup = mathGroup.replace("\\\\\(", "").replace("\\\\\)", "")
    } else if (
      mathGroup.substr(0, 3) === "\\\\\[" &&
      mathGroup.substr(mathGroup.length - 3) === "\\\\\]"
    ) {
      // mathGroup = mathGroup.replace("\\\\\[", "").replace("\\\\\]", "")
      mathGroup = `\\\[${mathGroup.substring(3, mathGroup.length - 3)}\\\]`
    }

    if (mathGroup.startsWith('$$') && mathGroup.endsWith('$$')) {
      mathGroup = `${mathGroup.substring(2, mathGroup.length - 2)}`
    }

    if (mathGroup.startsWith('$') && mathGroup.endsWith('$')) {
      mathGroup = `${mathGroup.substring(1, mathGroup.length - 1)}`
      return `$ ${mathGroup} $`
    }

    return `$$${mathGroup}$$`
    return mathGroup
  }

  // Replace all the math group placeholders in the text
  // with the saved strings.
  text = text.replace(/@@(\d+)@@/g, mathGroupProcess)
  return text
}

const regexSplit = (str, separator, limit) => {
  const output = []

  const flags = (separator.ignoreCase ? "i" : "") +
    (separator.multiline ? "m" : "") +
    (separator.extended ? "x" : "") + // Proposed for ES6
    (separator.sticky ? "y" : "") // Firefox 3+

  let lastLastIndex = 0
  let separator2
  let match
  let lastIndex
  let lastLength

  // Make `global` and avoid `lastIndex` issues by working with a copy
  separator = new RegExp(separator.source, flags + "g")

  const compliantExecNpcg = typeof (/()??/.exec("")[1]) === "undefined"
  if (!compliantExecNpcg) {
    // Doesn't need flags gy, but they don't hurt
    separator2 = new RegExp(`^${separator.source}$(?!\\s)`, flags)
  }
  /* Values for `limit`, per the spec:
   * If undefined: 4294967295 // Math.pow(2, 32) - 1
   * If 0, Infinity, or NaN: 0
   * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
   * If negative number: 4294967296 - Math.floor(Math.abs(limit))
   * If other: Type-convert, then use the above rules
  */

  limit = typeof (limit) === "undefined" ?
    -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)

  for (match = separator.exec(str); match; match = separator.exec(str)) {
    // `separator.lastIndex` is not reliable cross-browser
    lastIndex = match.index + match[0].length
    if (lastIndex > lastLastIndex) {
      output.push(str.slice(lastLastIndex, match.index));
      // Fix browsers whose `exec` methods don't consistently return `undefined` for
      // nonparticipating capturing groups
      if (!compliantExecNpcg && match.length > 1) {
        match[0].replace(separator2, () => {
          for (let i = 1; i < arguments.length - 2; i += 1) {
            if (typeof (arguments[i]) === "undefined") {
              match[i] = undefined
            }
          }
        })
      }
      if (match.length > 1 && match.index < str.length) {
        Array.prototype.push.apply(output, match.slice(1));
      }
      lastLength = match[0].length;
      lastLastIndex = lastIndex;
      if (output.length >= limit) {
        break
      }
    }
    if (separator.lastIndex === match.index) {
      separator.lastIndex++ // Avoid an infinite loop
    }
  }
  if (lastLastIndex === str.length) {
    if (lastLength || !separator.test("")) {
      output.push("")
    }
  } else {
    output.push(str.slice(lastLastIndex))
  }
  return output.length > limit ? output.slice(0, limit) : output
}
