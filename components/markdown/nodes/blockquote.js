import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => {
  return (
    <Pane
      borderLeft="3px solid #E4E7EB"
      marginLeft={20}
      paddingLeft={20}
      textTransform="italic"
    >
      <i>{props.children}</i>
    </Pane>
  )
}
