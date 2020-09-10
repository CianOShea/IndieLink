import React from 'react'
import { UnorderedList } from 'evergreen-ui'

export default (props) => {
  return (
    <UnorderedList
      marginBottom={16}
      fontSize={17}
      lineHeight={1.5}
    >
      {props.children}
    </UnorderedList>
  )
}
