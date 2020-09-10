/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { fromEvent } from 'file-selector'
import { Text, Pane, Button } from 'evergreen-ui'
import FileBrowserNest from './file-browser-nest'

const removeDuplicatesByKey = (myArr, key) =>
  myArr.filter((obj, pos, arr) =>
    arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === pos
  )

class preview extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isPreviewOpen: false,
    }
  }

  async onChangeTitle(e) {
    e.preventDefault()
    this.props.setTitle && this.props.setTitle(e.target.value)
  }

  setMain(main) {
    this.props.setMain(main)
  }

  async onDrop(droppedFiles) {
    const { files } = this.props
    let newFiles = files.concat(droppedFiles)
    const noDuplicateFiles = removeDuplicatesByKey(newFiles, 'name')
    this.props.setFiles && this.props.setFiles(noDuplicateFiles)

    if (files.length === 0) {
      const img = newFiles.find(f =>
        f.name.toLowerCase().endsWith('.png') ||
        f.name.toLowerCase().endsWith('.jpg') ||
        f.name.toLowerCase().endsWith('.jpeg') ||
        f.name.toLowerCase().endsWith('.git') ||
        f.name.toLowerCase().endsWith('.svg')
      )

      // if (img) {
      //   this.setMain(img.name)
      // }
    }
  }

  async removeFile(f) {
    const { files } = this.props
    if (f) {
      const newFiles = files.reduce((p, c) => (c.name !== f.name && p.push(c), p), [])
      this.props.setFiles && this.props.setFiles(newFiles)
    }
  }

  render() {
    const { user, main, title, files, setMain } = this.props

    return (
      <Pane>
        {/* <Dropzone
          getDataTransferItems={evt => fromEvent(evt)}
          onDrop={(f) => this.onDrop(f)}
          multiple
          style={{}}
        >
          <Pane
            border
            borderStyle="dashed"
            borderRadius={3}
            cursor="pointer"
            minHeight={200}
          >
            {files.length === 0 && (
              <Pane
                marginX="auto"
                marginTop={80}
                width={260}
                height={50}
              >
                <Text>
                  Drag and drop files(s) or <Button>Upload</Button>
                </Text>
              </Pane>
            )}
            {files.length > 0 && (
              <Pane>
                <FileBrowserNest
                  // marginTop={10}
                  files={files}
                  title={title}
                  author={user.nickname}
                  setFileToDelete={(f) => this.removeFile(f)}
                  selectFile={setMain ? (f) => this.setMain(f.name) : null}
                  selected={main}
                />
              </Pane>
            )}
          </Pane>
        </Dropzone> */}
      </Pane>
    )
  }
}

export default (preview)