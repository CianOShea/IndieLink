import React from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
//import js from 'react-syntax-highlighter/dist/languages/hljs/javascript'
//import python from 'react-syntax-highlighter/dist/languages/hljs/python'
//import r from 'react-syntax-highlighter/dist/languages/hljs/r'
//import githubGist from 'react-syntax-highlighter/dist/styles/hljs/github-gist'
import { Pane } from 'evergreen-ui'

// SyntaxHighlighter.registerLanguage('javascript', js)
// SyntaxHighlighter.registerLanguage('r', r)
// SyntaxHighlighter.registerLanguage('python', python)

export default (props) => {
  if (!props.input) githubGist.hljs.background = 'rgb(248, 248, 248)'
  if (props.input) githubGist.hljs.background = '#fff'
  return (
    <Pane
      border
      background="tint2"
      borderRadius={3}
      marginY={16}
      display="grid"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
    >
      <SyntaxHighlighter
        showLineNumbers
        lineNumberContainerStyle={{
          float: 'left',
          paddingRight: '10px',
          textAlign: 'right',
        }}
        lineNumberStyle={{
          color: 'rgba(27,31,35,.3)',
          paddingRight: '10px',
        }}
        language={props.language}
        style={githubGist}
        customStyle={{
          background: '#f6f8fa',
          margin: 0,
          lineHeight: '1.4',
          fontSize: '14px',
          borderRadius: '3px',
        }}
      >
        {props.value || ''}
      </SyntaxHighlighter>
    </Pane>
  )
}
