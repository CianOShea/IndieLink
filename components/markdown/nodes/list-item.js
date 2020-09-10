import React from 'react'
import { ListItem } from 'evergreen-ui'

export default (props) => {
  return (
    <ListItem
      fontSize={16}
      lineHeight={1.5}
      color="#1b1e23"
    >
      {props.children}
    </ListItem>
  )
}
