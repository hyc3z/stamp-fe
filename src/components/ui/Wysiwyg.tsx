
import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import Draft, { EditorState } from 'draft-js';
import {  ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';


const rawContentState = {
    entityMap: {
        '0': {
            type: 'IMAGE',
            mutability: 'MUTABLE',
            data: { src: 'http://i.imgur.com/aMtBIep.png', height: 'auto', width: '100%' },
        },
    },
    blocks: [
        {
            key: '7rjes',
            text: 'dedefe',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
};
type WysiwygState = {
    editorContent: any;
    contentState: any;
    editorState: EditorState | undefined;
};
class Wysiwyg extends Component<{},WysiwygState> {

    constructor(props: any) {
        super(props)
        const currentScript = localStorage.getItem("stamp-script-edit")
        let blocksFromHtml = htmlToDraft("");
        let msg = ""
        if (currentScript) {
            const jsonObj = JSON.parse(currentScript)
            msg = jsonObj["message"]
            blocksFromHtml = htmlToDraft(msg)
        }
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
            editorContent: msg,
            contentState: convertToRaw(contentState),
            editorState: editorState,
        }
    }

    onEditorChange = (editorContent: any) => {
        this.setState({
            editorContent,
        });
    };

    clearContent = () => {
        this.setState({
            contentState: '',
        });
    };

    onContentStateChange = (contentState: any) => {
        this.setState({
            contentState,
        });
    };

    onEditorStateChange = (editorState: any) => {
        this.setState({
            editorState,
        });
    };

    imageUploadCallBack = (file: any) =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
            const data = new FormData(); // eslint-disable-line no-undef
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        });

    render() {
        
        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom first="脚本编辑"  />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="脚本编辑器" bordered={false}>
                                <Editor
                                    contentState={this.state.contentState}
                                    editorState={this.state.editorState}
                                    toolbarClassName="home-toolbar"
                                    wrapperClassName="home-wrapper"
                                    editorClassName="home-editor"
                                    onEditorStateChange={this.onEditorStateChange}
                                    toolbar={{
                                        history: { inDropdown: true },
                                        inline: { inDropdown: false },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        image: { uploadCallback: this.imageUploadCallBack },
                                    }}
                                    onContentStateChange={this.onEditorChange}
                                    placeholder=""
                                    spellCheck
                                    onFocus={() => {
                                        // console.log('focus');
                                    }}
                                    onBlur={() => {
                                        // console.log('blur');
                                    }}
                                    onTab={() => {
                                        // console.log('tab');
                                        return true;
                                    }}
                                    localization={{
                                        locale: 'zh',
                                        translations: { 'generic.add': 'Test-Add' },
                                    }}
                                    mention={{
                                        separator: ' ',
                                        trigger: '@',
                                        caseSensitive: true,
                                        suggestions: [
                                            { text: 'A', value: 'AB', url: 'href-a' },
                                            { text: 'AB', value: 'ABC', url: 'href-ab' },
                                            { text: 'ABC', value: 'ABCD', url: 'href-abc' },
                                            { text: 'ABCD', value: 'ABCDDDD', url: 'href-abcd' },
                                            { text: 'ABCDE', value: 'ABCDE', url: 'href-abcde' },
                                            { text: 'ABCDEF', value: 'ABCDEF', url: 'href-abcdef' },
                                            {
                                                text: 'ABCDEFG',
                                                value: 'ABCDEFG',
                                                url: 'href-abcdefg',
                                            },
                                        ],
                                    }}
                                />

                                <style>{`
                                    .home-editor {
                                        min-height: 300px;
                                    }
                                `}</style>
                            </Card>
                        </div>
                    </Col>
                    {/* <Col className="gutter-row" md={8}>
                        <Card title="同步转换HTML" bordered={false}>
                            <pre>{draftToHtml(editorContent)}</pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换MarkDown" bordered={false}>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {draftToMarkdown(editorContent)}
                            </pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换JSON" bordered={false}>
                            <pre style={{ whiteSpace: 'normal' }}>
                                {JSON.stringify(editorContent)}
                            </pre>
                        </Card>
                    </Col> */}
                </Row>
            </div>
        );
    }
}

export default Wysiwyg;
