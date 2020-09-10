import React from 'react'
import TurndownService from 'turndown'
import Markdown from '../index'

const turndownPluginGfm = require('joplin-turndown-plugin-gfm')
// const turndownPluginGfm = require('turndown-plugin-gfm')

const turndownService = new TurndownService()
turndownService.use(turndownPluginGfm.gfm)
turndownService.remove('div')
turndownService.remove('style')

export default ({ urlMap }) => (props) => {
  const text = props.value
  const markdown = turndownService.turndown(text)

  if (text === markdown) {
    return text
  }

  return <Markdown source={markdown} urlMap={urlMap} />
}
