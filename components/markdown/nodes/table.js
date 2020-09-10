import React from 'react'
import { Pane } from 'evergreen-ui'

export default (props) => (
  <Pane overflowX="auto">
    <Pane
      border
      width="100%"
      marginBottom={16}
      is="table"
      style={{
        borderCollapse: 'collapse'
      }}
    >
      {props.children}
    </Pane>
  </Pane>
)
