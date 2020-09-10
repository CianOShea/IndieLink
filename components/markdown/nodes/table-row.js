import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => (
  <Pane
    borderspacing={0}
    border="none"
    is="tr"
  >
    {props.children}
  </Pane>
)
