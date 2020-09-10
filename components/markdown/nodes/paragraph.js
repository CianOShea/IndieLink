import React from 'react'
import { Paragraph } from 'evergreen-ui'

export default (props) => {
  if (!props.children) return null

  if (props.stylesOff) {
    return (
      <Paragraph>
        {props.children}
      </Paragraph>
    )
  }

  return (
    <Paragraph
      wordWrap="break-word"
      textAlign="left"
      marginLeft={0}
      marginRight={0}
      marginTop={0}
      marginBottom={16}
      fontSize={16}
      lineHeight={1.5}
      maxWidth={750}
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
      color="#1b1e23"
    >
      {props.children}
    </Paragraph>
  )
}
