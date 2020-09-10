import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => (
  <Pane
    border="none"
    is="tbody"
    width="100%"
    maxHeight={200}
  >
    {props.children}
  </Pane>
)
