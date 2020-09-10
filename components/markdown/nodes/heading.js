import React from 'react'
import { Heading, Link, Pane } from 'evergreen-ui'

export default (props) => {
  let id = ''
  try {
    id = props.children[0].props.value.replace(/\s+/g, '-')
  } catch (err) {}

  if (props.stylesOff) {
    return (
      <Pane>
        <Link
          href={`#${id}`}
          textDecoration="none"
        >
          <Heading
            marginY={20 - (2 * props.level)}
            size={1000 - (100 * props.level)}
            color="#333"
            id={id}
          >
            {props.children}
          </Heading>
        </Link>
      </Pane>
    )
  }

  return (
    <Pane
      borderBottom="0.5px solid #f0f2f5"
      marginBottom={16}
      paddingBottom={"0.3em"}
      marginTop={16}
    >
      <Link
        href={`#${id}`}
        textDecoration={"none"}
      >
        <Heading
          size={900 - (100 * props.level)}
          color="#333"
          fontWeight={600}
          lineHeight="1.25"
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility'
          }}
        >
          {props.children}
        </Heading>
      </Link>
      <Pane
        display="table-column"
        zIndex={-1}
        is="span"
        id={id}
        position="relative"
        top={-120}
        opacity={0}
      >#{id}</Pane>
    </Pane>
  )
}
