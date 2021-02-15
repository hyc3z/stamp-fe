
import React, { Component, useContext, useState } from 'react';
import { Row, Col, Card, Input, Form, Button, Icon, message } from 'antd';
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
import FormItem from 'antd/lib/form/FormItem';
import Axios from 'axios';
import { type } from 'os';
import FileContext from '../../context/FileContext';

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
    const {wstate, changeState, changeScriptPath} = useContext(WysiwygContext)
    
    let history = useHistory();
    const {fstate, refreshFileBrowser} =  useContext(FileContext)
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

    
    const handleSaveScript = (e: any) => {
        e.preventDefault()
        let body2 = ""
        // console.log(wstate.editorContent, typeof(wstate.editorContent)  )
        if(typeof(wstate.editorContent) !== "string"){
            (wstate.editorContent["blocks"]).forEach((element: any) => {
                body2 += element["text"]
                body2 += "\n"
            });
        } else {
            body2 = wstate.editorContent
        }
        // console.log(body2, typeof(body2)  )
        
        Axios({
            method: 'POST',
            url: 'file/editScript',
            data: body2,
            headers: { 
                "Content-Type": "text/plain",
                "filename": wstate.scriptPath
            }
        }).then(({data}) => {
            message.success("上传成功")
            console.log(data)
        }).catch((err) =>{
            message.error("上传失败")
            console.log(err)
        }).finally(() =>{
            refreshFileBrowser()
            history.push("/hpc/files")
        })
    }
        
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
                                    toolbarHidden={true}
                                    toolbarClassName="home-toolbar"
                                    wrapperClassName="home-wrapper"
                                    editorClassName="home-editor"
                                    onEditorStateChange={onEditorStateChange}
                                    toolbar={{
                                        // history: { inDropdown: true },
                                        // inline: { inDropdown: false },
                                        // list: { inDropdown: true },
                                        // textAlign: { inDropdown: true },
                                        // image: { uploadCallback: imageUploadCallBack },
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
                    {/* <Col className="gutter-row" md={8}>
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
                                </Col> */}
                    {/* <Col className="gutter-row" md={8}>
                        <Card title="同步转换JSON" bordered={false}>
                            <pre style={{ whiteSpace: 'normal' }}>
                                {(wstate.editorContent)}
                            </pre>
                        </Card>
                    </Col>  */}
                </Row>
                <Card title="保存脚本" bordered={false}>
                    <Row>
                    <span>
                        <Form  
                        name="customized_form_controls"
                        layout="inline"
                        onSubmit={handleSaveScript}
                      >
                            
                       
                    <FormItem  label="保存名称" >
                        <Input
                            prefix={<Icon type="book" style={{ fontSize: 13 }} />}
                            placeholder={wstate.scriptPath}
                            onChange={(e) => {
                                changeScriptPath(e.target.value)
                                //changeScriptPath()
                            }}
                        />
                    </FormItem>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                    </Form>
                    </span>
                    </Row>
                </Card>
                
            </div>
            
        );
}

