import React from 'react'
import { Text, Link } from 'evergreen-ui'

export default (props) => {
  if (props.href.startsWith('http') || props.href.startsWith('https')) {
    return (
      <Text
        style={{
          // fontFamily: "Iowan Old Style,Apple Garamond,Baskerville,Palatino Linotype,Times New Roman,Droid Serif,Times,Source Serif Pro,serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}
        fontSize={props.stylesOff ? 14 : 16}
      >
        <Link
          fontSize={props.stylesOff ? 14 : 16}
          lineHeight={1.5}
          target="_blank"
          color="#008abc"
          textDecoration="none"
          overflow-wrap="break-word"
          wordWrap="break-word"
          cursor="pointer"
          href={props.href}
        >
          {props.children}
        </Link>
      </Text>
    )
  }

  return (
    <Text
      style={{
        // fontFamily: "Iowan Old Style,Apple Garamond,Baskerville,Palatino Linotype,Times New Roman,Droid Serif,Times,Source Serif Pro,serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility'
      }}
      fontSize={16}
    >
      <Link
        color="#008abc"
        textDecoration="none"
        overflow-wrap="break-word"
        wordWrap="break-word"
        cursor="pointer"
        href={props.href}
        fontSize={props.stylesOff ? 14 : 16}
        lineHeight={1.5}
      >
        {props.children}
      </Link>
    </Text>
  )
}
