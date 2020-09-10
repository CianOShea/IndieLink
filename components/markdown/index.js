/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

/* global window */
import ReactDOM from 'react-dom'
import { Pane } from 'evergreen-ui'
import loadScript from 'load-script'
import ReactMarkdown from 'react-markdown'
import React, { Component } from 'react'
import metadataParser from 'markdown-yaml-metadata-parser'
import parseMD from './parse-md'
import Hr from './nodes/hr'
import Div from './nodes/div'
import Code from './nodes/code'
import List from './nodes/list'
import ListItem from './nodes/list-item'
import Html from './nodes/html'
import VirtualHtml from './nodes/virtual-html'
import Image from './nodes/image'
import Link from './nodes/link'
import Table from './nodes/table'
import Heading from './nodes/heading'
import TableRow from './nodes/table-row'
import Paragraph from './nodes/paragraph'
import TableHead from './nodes/table-head'
import TableBody from './nodes/table-body'
import TableCell from './nodes/table-cell'
import Blockquote from './nodes/blockquote'
import InlineCode from './nodes/inline-code'
import { removeMath, replaceMath } from './mathjax-utils'

const SCRIPT = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML'

export default class extends Component {
  constructor(props) {
    super(props)
    this.element = React.createRef()
  }

  componentDidMount() {
    if (window.MATHJAX_LOADED) {
      this.renderMath()
    } else {
      loadScript(SCRIPT, (err) => this.onLoad(err))
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!nextProps.math) return false
    return nextProps.math !== this.state.oldMath
  }

  componentDidUpdate() {
    this.renderMath()
  }

  onLoad(err) {
    window.MATHJAX_LOADED = true
    if (err) {
      console.log(err)
      return
    }
    this.configureMathjax()
    this.renderMath()
  }

  configureMathjax() {
    window.MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [['$', '$'], ["\\(", "\\)"]],
        displayMath: [['$$', '$$'], ["\\[", "\\]"]],
        processEscapes: true,
        processEnvironments: true
      },
      MathML: {
        extensions: ['content-mathml.js']
      },
      displayAlign: 'center',
      "HTML-CSS": {
        availableFonts: [],
        imageFont: null,
        preferredFont: null,
        webFont: "STIX-Web",
        styles: {
          '.MathJax_Display': { margin: 0 }
        },
        linebreaks: { automatic: true }
      },
    })
    window.MathJax.Hub.Configured()
  }

  renderMath() {
    const { source } = this.props
    const { content } = parseMD(source)
    try {
      const [text, math] = removeMath(content)
      const element = ReactDOM.findDOMNode(this)
      element.innerHTML = replaceMath(element.innerHTML, math)
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, element])
    } catch (err) {
      // console.log(err)
    }
  }

  render() {
    const { source, linkPrefix = '', urlMap, input, ...extraProps } = this.props

    if (!source) {
      return (<Pane />)
    }

    let { metadata, content } = metadataParser(source) // parseMD(source)

    content = content
      .replace(/<style scoped>/g, '<style>')
      .replace(/<div>/g, '')
      .replace(/<\/div>/g, '')

    const [text, math] = removeMath(content)

    let mdText = text

    // if (urlMap) {
    //   Object.keys(urlMap).forEach(name => {
    //     const blob = urlMap[name]
    //     mdText = mdText.split(name).join(blob)
    //   })
    // }

    const imagePreprocessor = (source) => source.replace(/(!\[[^\]]*\]\([^)\s]+) =([0-9]+x|x[0-9]+|[0-9]+x[0-9]+)\)/g, '$1_33B2BF251EFD_$2)')

    mdText = imagePreprocessor(mdText)

    const renderers = {
      blockquote: Blockquote,
      inlineCode: InlineCode,
      paragraph: Paragraph,
      tableHead: TableHead,
      tableBody: TableBody,
      tableCell: TableCell,
      tableRow: TableRow,
      heading: Heading,
      table: Table,
      list: List,
      listItem: ListItem,
      image: Image,
      html: Html({ urlMap }),
      virtualHtml: VirtualHtml,
      code: (props) => {
        return <Code {...props} input={input} />
      },
      link: Link,
      div: Div,
      thematicBreak: Hr
    }

    const renderersWithExtraProps = Object.keys(renderers).reduce((acc, key) => {
      acc[key] = (props) => {
        const newProps = { ...extraProps, ...props }
        return renderers[key](newProps)
      }
      return acc
    }, {})

    const newProps = {
      source: mdText,
      escapeHtml: false,
      input,
      renderers: renderersWithExtraProps,
      transformImageUri: (uri) => {
        if (urlMap && uri.replace('./', '') in urlMap) {
          // `${uri} - ${uri.replace('./', '')} is in urlMap`
          return urlMap[uri.replace('./', '')]
        }

        if (urlMap && "*" in urlMap) {
          return `${urlMap['*']}/${uri.replace('./', '')}`
        }

        return uri
      },
      transformLinkUri: (uri) => {
        if (!uri) return uri
        if (uri.startsWith('#')) return uri

        if (uri.startsWith('http')) {
          return uri
        }

        if (uri.startsWith('/')) {
          return `${linkPrefix}/file${uri}`
        }
        return `${linkPrefix}/file/${uri}`
      },
    }

    return (
      <Pane
        color="#1b1e23"
        margin={0}
        padding={0}
        wordWrap="break-word"
        is="div"
      >
        <div ref={this.element} >
          <ReactMarkdown {...newProps} />
        </div>
      </Pane>
    )
  }
}
