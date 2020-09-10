import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => {
  return (
    <Pane>
      {props.children}
    </Pane>
  )
}
