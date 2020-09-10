/* This file is part of IndieLink. IndieLink is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. IndieLink is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with IndieLink.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react'
import { Text, Icon, Pane, Button, Badge } from 'evergreen-ui'

class FileBrowser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFileBrowserOpen: true,
      file: ''
    }
  }

  render() {
    const { files, selectFile, selected, setFileToDelete } = this.props
    const { isFileBrowserOpen } = this.state

    return (
      <Pane>
        {files.length === 0 && (<Badge marginBottom={10}>No files attached</Badge>)}
        {files.length > 0 && (
          <Pane marginTop={8} marginBottom={20}>
            {isFileBrowserOpen && files && Object.keys(files).map(key => {
              if (typeof files[key] === 'string') {
                return null
              }
              return (
                <Pane
                  paddingY={4}
                  paddingX={9}
                  marginBottom={-1}
                  key={key}
                  borderTop
                  borderBottom
                  background="tint2"
                >
                  <Text>
                    <Icon
                      icon="document"
                      size={12}
                      marginRight={8}
                    />
                    {files[key].path || files[key].name}
                  </Text>

                  {selectFile && (
                    <Button
                      paddingTop={0}
                      paddingBottom={0}
                      paddingRight={8}
                      paddingLeft={8}
                      marginTop={-4}
                      marginRight={8}
                      appearance="minimal"
                      float="left"
                      iconBefore={(files[key].path === selected || files[key].name === selected) ? 'tick-circle' : 'circle'}
                      intent="success"
                      outline="none!important"
                      boxShadow="none!important"
                      onClick={(e) => {
                        e.preventDefault()
                        selectFile(files[key])
                      }}
                    >
                      {(files[key].path === selected || files[key].name === selected) ? 'Main' : 'Set as main'}
                    </Button>
                  )}
                  {setFileToDelete && (
                    <Button
                      paddingTop={0}
                      paddingBottom={0}
                      paddingRight={0}
                      paddingLeft={8}
                      marginTop={-4}
                      appearance="minimal"
                      intent="danger"
                      float="right"
                      iconBefore="trash"
                      onClick={(e) => {
                        e.preventDefault()
                        setFileToDelete(files[key])
                      }}
                    />
                  )}


                </Pane>
              )
            })}
          </Pane>
        )}
      </Pane>
    )
  }
}

export default (FileBrowser)