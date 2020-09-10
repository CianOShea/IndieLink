import React from 'react'
import { Pane, TextInput, Button } from 'evergreen-ui'
import FilesForm from '../files-form'
import AddTags from '../../study-config/add-tags-input'
import MarkdownEditor from '../markdown-editor'

export default class CreateReportPane extends React.Component {
  render() {
    const { title, type, user, team, files, main, urlMap, tags, isBusy, text } = this.props

    return (
      <Pane
        background="white"
        padding={16}
        borderRadius={3}
        border
      >
        <TextInput
          height={38}
          border="1px solid #E4E7EB!important"
          boxShadow="none!important"
          width="100%"
          type="text"
          placeholder="Title"
          marginBottom={10}
          autoComplete="off"
          value={title || ''}
          onChange={(e) => this.props.setTitle && this.props.setTitle(e.target.value)}
        />

        {type === 'study' && (
          <FilesForm
            user={user}
            team={team}
            title={title}
            files={files}
            main={main}
            setMain={(newMain) => this.props.setMain && this.props.setMain(newMain)}
            setFiles={(newFiles) => this.props.setFiles && this.props.setFiles(newFiles)}
            setTitle={(newTitle) => this.props.setTitle && this.props.setTitle(newTitle)}
            setText={(newText) => this.props.setText && this.props.setText(newText)}
          />
        )}
        {type !== 'study' && (
          <Pane marginTop={16}>
            <MarkdownEditor
              placeholder="Write your report"
              uploadsAllowed={true}
              allowPreview={true}
              urlMap={urlMap}
              text={text}
              files={files}
              height={type === 'report' ? 500 : 120}
              setTitle={(newTitle) => this.props.setTitle && this.props.setTitle(newTitle)}
              setText={(newText) => this.props.setText && this.props.setText(newText)}
              setFiles={(newFiles) => this.props.setFiles && this.props.setFiles(newFiles)}
            />
          </Pane>
        )}
        <Pane marginTop={16}>
          <AddTags
            tags={tags}
            team={team}
            onChange={(newTags) => this.props.onAddNewTags && this.props.onAddNewTags(newTags)}
          />
        </Pane>

        <Pane marginTop={12} display="flex">
          <Pane flex={1} />
          <Pane>
            <Button
              marginLeft={8}
              marginTop={6}
              appearance={"primary"}
              intent="success"
              iconAfter="arrow-right"
              isLoading={isBusy}
              onClick={() => this.props.upload && this.props.upload()}
            >
              Publish the {(type === 'report') ? 'Report' : 'Notebook' }
            </Button>
          </Pane>
        </Pane>
      </Pane>
    )
  }
}
