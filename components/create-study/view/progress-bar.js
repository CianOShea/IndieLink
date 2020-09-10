import React from 'react'
import { Pane } from 'evergreen-ui'

export default class CreateStudyProgressBar extends React.Component {
  render() {
    const { progress } = this.props
    return (
      <Pane>
        {progress && (
          <Pane
            marginTop={16}
            borderBottom="2px solid #F5F6F7"
            width="100%"
          >
            <Pane
              marginTop={16}
              marginBottom={-2}
              borderBottom="2px solid #1070CA"
              width={`${progress}%`}
            />
          </Pane>
        )}
      </Pane>
    )
  }
}

