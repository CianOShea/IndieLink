/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'
import { TextInput, Icon, Link, Pane, Text, Textarea, Button, Tab, toaster } from 'evergreen-ui'
import MarkdownToolbar from './markdown-toolbar'
import PropTypes from 'prop-types'
import FileBrowserNest from './file-browser-nest'
import Markdown from '../markdown'

const isImage = (name) =>
  name.toLowerCase().endsWith('.png') ||
  name.toLowerCase().endsWith('.jpg') ||
  name.toLowerCase().endsWith('.jpeg') ||
  name.toLowerCase().endsWith('.git') ||
  name.toLowerCase().endsWith('.svg')

class markdowneditor extends Component {    

    static propTypes = {
        files: PropTypes.array.isRequired,
        text: PropTypes.string.isRequired,
        setText: PropTypes.func.isRequired,
        setFiles: PropTypes.func.isRequired,
        urlMap: PropTypes.object,
        uploadsAllowed: PropTypes.bool,
        placeholder: PropTypes.string,
        height: PropTypes.number,
        allowPreview: PropTypes.bool,
        prependFilesToPreview: PropTypes.bool
    }

    static defaultProps = {
        urlMap: {},
        height: 350,
        allowPreview: true,
        uploadsAllowed: true,
        placeholder: "Write a post",
        prependFilesToPreview: false
    }

    constructor(props) {
        super(props)
        this.state = { isPreviewOpen: false }
    }

    async onChange (e) {
        e.preventDefault()
        this.setState({ [e.target.name]: e.target.value })
    }

    async onAddImage(file) {
        const { files, setFiles } = this.props
        const existingFile = files.find(existing => existing.name === file.name)
        if (existingFile) return
        const newFiles = files.concat([file])
        setFiles(newFiles)
    }
    
    async onDrop(droppedFiles) {
        const { files, setFiles } = this.props
        const newFiles = files.concat(droppedFiles)
        const noDuplicateFiles = removeDuplicatesByKey(newFiles, 'name')
        setFiles(noDuplicateFiles)
    }
    
    async removeFile(f) {
        const { files } = this.props
        if (f) {
            const newFiles = files.reduce((p, c) => (c.name !== f.name && p.push(c), p), [])
            this.props.setFiles && this.props.setFiles(newFiles)
        }
    }


    render() {

        const { isPreviewOpen } = this.state
        const { prependFilesToPreview, urlMap, files, placeholder, allowPreview, text, setText, height, uploadsAllowed } = this.props
        let mdText = text

        if (prependFilesToPreview) {
            [...files].reverse().forEach(file => {
              mdText = `${mdText}\n`
              if (isImage(file.name)) {
                mdText = `![${file.name}](${file.name})\n\n${mdText}`
              } else {
                mdText = `[${file.name}](${file.name})\n\n${mdText}`
              }
            })
        }
        return (
            <div>
                <Pane
                    border
                    borderRadius={5}
                >
                    <Pane
                        borderBottom
                        background="tint1"
                        borderTopLeftRadius={5}
                        borderTopRightRadius={5}
                        minHeight={39}
                    >
                        
                        <Fragment>
                            <Tab
                            margin={5}
                            appearance="minimal"
                            isSelected={!isPreviewOpen}
                            onSelect={() => this.setState({ isPreviewOpen: false })}
                            boxShadow="none!important"
                            outline="none!important"
                            >
                            Write
                            </Tab>
                            <Tab
                            margin={5}
                            isSelected={isPreviewOpen}
                            appearance="minimal"
                            onSelect={() => this.setState({ isPreviewOpen: true })}
                            boxShadow="none!important"
                            outline="none!important"
                            >
                            Preview
                            </Tab>
                        </Fragment>
                        

                        {!isPreviewOpen && (
                        <MarkdownToolbar
                            textAreaID={'textareaId'}
                            onSelectStyle={(newText) => setText(newText)}
                            onAddImage={(file) => this.onAddImage(file)}
                        />
                        )}

                        {!isPreviewOpen && (
                            <Pane>
                                <Textarea
                                    borderRadius={0}
                                    boxShadow="none!important"
                                    outline="none!important"
                                    id="textareaId"
                                    placeholder={placeholder}
                                    height={height}
                                    padding={20}
                                    value={text}
                                    minHeight={100}
                                    maxHeight={500}
                                    onChange={e => {
                                    e.preventDefault()
                                    setText(e.target.value)
                                    }}
                                />

                            {/* Dropzone stuff goes here */}

                            </Pane>
                        )}

                        {isPreviewOpen && (
                            <Pane padding={20} maxWidth="100%">
                            {mdText && (
                                <Markdown source={mdText} urlMap={urlMap} />
                            )}
                            {!mdText && (
                                <Text>Nothing to preview</Text>
                            )}
                            </Pane>
                        )}
                    </Pane>
                </Pane>
            </div>
        )
    }
}


export default markdowneditor