
import React, { Component, useContext, useState } from 'react';
import { Row, Col, Card } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { ContentBlock, Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import Draft, { EditorState } from 'draft-js';
import {  ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import WysiwygContext from '../../context/WysiwigContext';
import { useHistory } from 'react-router-dom'

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

export default function Wysiwyg () {
    const {wstate, changeState} = useContext(WysiwygContext)
    let history = useHistory();

    const onEditorChange = (editorContent: any) => {
       const curState = {...wstate}
       curState.editorContent = editorContent
       changeState(curState)
    };

    const clearContent = () => {
        const curState = {...wstate}
        curState.contentState = ""
        changeState(curState)
    };

    const onContentStateChange = (contentState: any) => {
        const curState = {...wstate}
        curState.contentState = contentState
        changeState(curState)
    };

    const onEditorStateChange = (editorState: any) => {
        const curState = {...wstate}
        curState.editorState = editorState
        changeState(curState)
    };

    const imageUploadCallBack = (file: any) =>
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

    
        
        return (
            
<div className="gutter-example button-demo">
                <BreadcrumbCustom first="脚本编辑"  />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="脚本编辑器" bordered={false}>
                                <Editor
                                    contentState={wstate.contentState}
                                    editorState={wstate.editorState}
                                    toolbarClassName="home-toolbar"
                                    wrapperClassName="home-wrapper"
                                    editorClassName="home-editor"
                                    onEditorStateChange={onEditorStateChange}
                                    toolbar={{
                                        history: { inDropdown: true },
                                        inline: { inDropdown: false },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        image: { uploadCallback: imageUploadCallBack },
                                    }}
                                    onContentStateChange={onEditorChange}
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
                                        trigger: '#',
                                        caseSensitive: true,
                                        suggestions: [
                                            {
                                                text: 'SBATCH',
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
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换HTML" bordered={false}>
                            <pre>{draftToHtml(wstate.editorContent)}</pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换MarkDown" bordered={false}>
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                                {draftToMarkdown(wstate.editorContent)}
                            </pre>
                        </Card>
                    </Col>
                    <Col className="gutter-row" md={8}>
                        <Card title="同步转换JSON" bordered={false}>
                            <pre style={{ whiteSpace: 'normal' }}>
                                {JSON.stringify(wstate.editorContent)}
                            </pre>
                        </Card>
                    </Col>
                </Row>
            </div>
            
        );
}

