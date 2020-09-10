import React from 'react'
import { Pane, Text } from 'evergreen-ui'

export default (props) => (
  <Pane
    textAlign="left"
    border="none"
    borderTop="1px solid #EDF0F2"
    paddingY={4}
    paddingX={8}
    is={props.isHeader ? 'th' : 'td'}
    whiteSpace="nowrap"
    boxSizing="border-box"
  >
    <Text
      fontSize="12px"
      lineHeight="16px"
      fontWeight={props.isHeader ? 600 : 400}
    >
      {props.children}
    </Text>
  </Pane>
)
