import React from 'react'
import { Code } from 'evergreen-ui'

export default (props) => (
  <Code>
    {props.value || ''}
  </Code>
)
