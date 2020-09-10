import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => (
  <Pane
    backgroundColor="#F5F6F7"
    border="none"
    is="thead"
  >
    {props.children}
  </Pane>
)
