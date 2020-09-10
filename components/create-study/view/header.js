import React from 'react'
import { Pane, Heading, Text, Icon, Button, Dialog, Paragraph } from 'evergreen-ui'
//import { ButtonLink } from '../../evergreen-custom/button-link'

export default class CreateReportHeader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDialogOpen: false,
      isDeleteBusy: false
    }
  }

  async onConfirm() {
    this.setState({ isDeleteBusy: true })
    this.props.onConfirm && this.props.onConfirm()
    this.setState({ isDialogOpen: false, isDeleteBusy: false })
  }

  async openDialog() {
    this.setState({ isDialogOpen: !this.state.isDialogOpen })
  }

  render() {
    const { version, type, text, title, isDraftSaved, study } = this.props
    const { isDialogOpen, isDeleteBusy } = this.state

    return (
      <Pane marginBottom={16}>
        <Pane flex={-1} display="flex" marginLeft="auto" marginRight="auto">
          <Pane flex={1} display="flex" paddingBottom={12} alignItems="center">
            <Heading size={700}>
              {!version && type === 'report' && `Write a Report`}
              {!version && type !== 'report' && `Upload a Notebook`}
              {version && `Update your Report`}
            </Heading>
          </Pane>
          {(text || title) && (
            <Pane>
              {isDraftSaved === 'saving' && (
                <Text color="muted" marginRight={20} marginTop={7}>
                  Saving...
                </Text>
                )}
              {isDraftSaved === 'true' && (
                <Text color="muted" marginRight={20} marginTop={7}>
                  <Icon size={12} icon="saved" /> All changes saved in local storage
                </Text>
              )}
              <Button
                iconBefore="trash"
                intent="danger"
                onClick={() => this.openDialog()}
              >
                Clear Editor
              </Button>
            </Pane>
          )}
          <Dialog
            isShown={isDialogOpen}
            hasHeader={false}
            intent="danger"
            isConfirmLoading={isDeleteBusy}
            onCloseComplete={() => this.setState({ isDialogOpen: false })}
            onConfirm={() => this.onConfirm()}
            confirmLabel="Yes, Clean"
          >
            <Paragraph padding={40}>
              Are you sure you want to clear the editor? This cannot be reversed.
            </Paragraph>
          </Dialog>
        </Pane>

        <Pane>
          {version && (
            <Button
              href={`/${study.team ? study.team.name : study.user.nickname}/${study.name}`}
              aria-label="back to report"
              appearance="minimal"
              iconBefore="arrow-left"
            >
              Back to report
            </Button>
          )}
        </Pane>
      </Pane>
    )
  }
}
