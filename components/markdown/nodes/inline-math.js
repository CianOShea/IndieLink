import React from 'react'
import * as MathJax from '@nteract/mathjax'

export default (props) => (
  <MathJax.Node inline>{props.value}</MathJax.Node>
)
