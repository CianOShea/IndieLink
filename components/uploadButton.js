import React, { Component } from 'react'
import { Button, Menu, Pane, Icon, Text, Paragraph, Popover, Position } from 'evergreen-ui'

export default class uploadButton extends Component {

    async onImage(e) {
        e.preventDefault()
        this.setState({ filetype: 'image' })
    }

    render() {
        return (
            <div>
                <Popover              
                    position={Position.BOTTOM_LEFT}              
                    content={({close}) => (
                    <Menu>
                        <Pane>
                        <Pane
                            marginY={16}
                        />                
                            <Menu.Item
                            paddingY={32}
                            onSelect={(e) => this.onImage(e)}
                            //onSelect={close} 
                                                                         
                            >
                            <Pane alignItems="center" display="flex">
                                <Pane marginRight={12}>
                                <Text><Icon color="muted" icon="media" /></Text>
                                </Pane>
                                <Pane>
                                <Text size={500} fontWeight={500}>
                                    Image
                                </Text>
                                <Paragraph color="muted">
                                    Upload an image or GIF.
                                </Paragraph>
                                </Pane>
                            </Pane>
                            </Menu.Item>   
                
                            <Menu.Item
                            paddingY={32}
                            onSelect={close}
                            >
                            <Pane alignItems="center" display="flex">
                                <Pane marginRight={12}>
                                <Text><Icon color="muted" icon="mobile-video" /></Text>
                                </Pane>
                                <Pane>
                                <Text size={500} fontWeight={500}>
                                    Video
                                </Text>
                                <Paragraph color="muted">
                                    Upload a clip for everyone to see.
                                </Paragraph>
                                </Pane>
                            </Pane>
                            </Menu.Item>              

                            <Menu.Item
                            paddingY={32}
                            onSelect={close}
                            >
                            <Pane alignItems="center" display="flex">
                                <Pane marginRight={12}>
                                <Text><Icon color="muted" icon="volume-up" /></Text>
                                </Pane>
                                <Pane>
                                <Text size={500} fontWeight={500}>
                                    Audio
                                </Text>
                                <Paragraph color="muted">
                                    Upload an audio clip or a song
                                </Paragraph>
                                </Pane>
                            </Pane>
                            </Menu.Item>             

                            <Menu.Item
                            paddingY={32}
                            onSelect={close}
                            >
                            <Pane alignItems="center" display="flex">
                                <Pane marginRight={12}>
                                <Text><Icon color="muted" icon="code" /></Text>
                                </Pane>
                                <Pane>
                                <Text size={500} fontWeight={500}>
                                    Code
                                </Text>
                                <Paragraph color="muted">
                                    Upload a piece of code
                                </Paragraph>
                                </Pane>
                            </Pane>
                            </Menu.Item>                    
                        
                        <Pane
                            marginY={16}
                        />
                        </Pane>
                    </Menu>
                    )}
                    >
                        <Button marginRight={16} iconBefore="upload">Upload</Button>
                </Popover>
            </div>
        )
    }
}
