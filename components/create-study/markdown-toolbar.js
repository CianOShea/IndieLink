// source https://github.com/seibelj/react-simple-markdown-editor/blob/master/src/simple_markdown_editor.js
/* global window */
import React, { Component, Fragment } from 'react'
import { Button, Icon, Tooltip, Position, Popover, Menu, Pane } from 'evergreen-ui'
import AddImg from './add-img'

class SimpleMarkdownEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
          picture: false,
          picturePreview: false,
        }
    }

    onAddPreview(file) {
        const name = file.name
        this.wrapText('![', ']', `(${name})`)
        this.props.onAddImage && this.props.onAddImage(file)
    }

    wrapText(symbol, endSymbol, insertAfter) {
        if (!endSymbol) {
          endSymbol = symbol
        }
    
        const elem = window.document.getElementById(this.props.textAreaID)
        const start = elem.selectionStart
        const end = elem.selectionEnd
        const text = elem.value
    
        const afterText = insertAfter || ''
    
        elem.value = text.substring(0, start) + symbol + text.substring(start, end) + endSymbol + afterText + text.substring(end, text.length);
        elem.focus();
        elem.setSelectionRange(start + symbol.length, end + endSymbol.length);
    
        this.props.onSelectStyle && this.props.onSelectStyle(elem.value)
    }

    insertBold() {
        this.wrapText('**')
    }
    
    insertItalics() {
        this.wrapText('_')
    }

    insertCode() {
        this.wrapText('```')
    }

    insertMath() {
        this.wrapText('$$')
    }

    insertAtBeginningOfLine(symbol) {
        const elem = window.document.getElementById(this.props.textAreaID)
        const start = elem.selectionStart
        const end = elem.selectionEnd
        const text = elem.value

        const newLineIndex = text.lastIndexOf('\n', start - 1)
        if (newLineIndex === -1) {
            elem.value = symbol + text
        } else {
            elem.value = text.substring(0, newLineIndex + 1) + symbol + text.substring(newLineIndex + 1, text.length)
        }
        elem.focus()
        elem.setSelectionRange(start + symbol.length, end + symbol.length)
    }

    insertH1() {
        this.insertAtBeginningOfLine('# ')
    }

    insertH2() {
        this.insertAtBeginningOfLine('## ')
    }

    insertH3() {
        this.insertAtBeginningOfLine('### ')
    }

    insertQuote() {
        this.insertAtBeginningOfLine('> ')
    }

    insertBullet() {
        this.insertAtBeginningOfLine('* ')
    }

    insertLink() {
        const elem = window.document.getElementById(this.props.textAreaID)
        const start = elem.selectionStart
        const end = elem.selectionEnd
        const text = elem.value
        const link = "(http://www.mylink.com/)"

        if (start === end) {
            elem.value = `${text.substring(0, start)}[Link Text]${link}${text.substring(start, text.length)}`
            elem.focus()
            elem.setSelectionRange(start, start)
        } else {
            this.wrapText('[', ']', link)
        }
    }

    

    render() {
        return (
            <Pane padding={5} float="right" marginRight={10}>
                
                <Popover
                    minWidth={50}
                    position={Position.BOTTOM_Left}
                    content={
                    <Menu>
                        <Menu.Group>
                        <Menu.Item onClick={e => this.insertH1(e)}>
                            H1
                        </Menu.Item>
                        <Menu.Item onClick={e => this.insertH2(e)}>
                            H2
                        </Menu.Item>
                        <Menu.Item onClick={e => this.insertH3(e)}>
                            H3
                        </Menu.Item>
                        </Menu.Group>
                    </Menu>
                    }
                >
                <Tooltip content="Add header text" position={Position.TOP}>
                    <Button color="muted" appearance="minimal" paddingLeft={8} paddingRight={8}>
                        <i className="fa fa-header" aria-hidden="true"></i>                        
                    </Button>
                </Tooltip>
                </Popover>
                
                <Button appearance="minimal" color="muted" onClick={e => this.insertBold(e)} paddingLeft={8} paddingRight={8}>
                <Tooltip content="Add bold text" position={Position.TOP}>
                    <Icon icon="bold" color="#66788A" />
                </Tooltip>
                </Button>
                <Button appearance="minimal" color="muted" onClick={e => this.insertItalics(e)} marginRight={30} paddingLeft={8} paddingRight={8}>
                <Tooltip content="Add italic text" position={Position.TOP}>
                    <Icon icon="italic" color="#66788A" />
                </Tooltip>
                </Button>

                <Button appearance="minimal" color="muted" onClick={e => this.insertCode(e)} paddingLeft={8} paddingRight={8}>
                <Tooltip content="Insert code" position={Position.TOP}>
                    <Icon icon="code" color="#66788A" />
                </Tooltip>
                </Button>
                <Button appearance="minimal" color="muted" onClick={e => this.insertQuote(e)} paddingLeft={8} paddingRight={8}>
                <Tooltip content="Insert a quote" position={Position.TOP}>
                    <Icon icon="citation" color="#66788A" />
                </Tooltip>
                </Button>
                <Button appearance="minimal" color="muted" onClick={e => this.insertLink(e)} paddingLeft={8} paddingRight={8} marginRight={30}>
                <Tooltip content="Add a link" position={Position.TOP}>
                    <Icon icon="link" color="#66788A" />
                </Tooltip>
                </Button>

                <Button appearance="minimal" color="muted" onClick={e => this.insertBullet(e)} marginRight={30} paddingLeft={8} paddingRight={8}>
                <Tooltip content="Add a bulleted list" position={Position.TOP}>
                    <Icon icon="properties" color="#66788A" />
                </Tooltip>
                </Button>
                <Tooltip content="Add an image" position={Position.TOP}>
                    <AddImg onSelectPicture={(file) => this.onAddPreview(file)} />  
                </Tooltip>              

                <Tooltip content="Insert a mathematical equation" position={Position.TOP}>
                    <Button appearance="minimal" color="muted" paddingLeft={8} paddingRight={8} onClick={e => this.insertMath(e)}>
                        <i className="fa fa-calculator" aria-hidden="true"></i>
                    </Button>
                </Tooltip>
            </Pane>
        )
    }
}


export default (SimpleMarkdownEditor)