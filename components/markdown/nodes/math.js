import React from 'react'
import * as MathJax from '@nteract/mathjax'

export default (props) => (
  <MathJax.Node>{props.value}</MathJax.Node>
)
