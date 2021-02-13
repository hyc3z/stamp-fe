
import React, { useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import AllComponents from '../components';
import routesConfig, { IFMenuBase, IFMenu } from './config';
import queryString from 'query-string';
import Axios from 'axios';
import WysiwygContext, {WysiwygState} from '../context/WysiwigContext'
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import Draft, { EditorState } from 'draft-js';
import {  ContentState, convertToRaw } from 'draft-js';
import FileContext, { FileState } from '../context/FileContext';

// import App from '../App';
// import NotFound from '../components/pages/NotFound';
// import Login from '../components/pages/Login';
// import AuthData from '../App'


export default function CRouter () {
    
    
    const requireLogin = (component: React.ReactElement) => {
      
        const permissions = async () => {
            const res = await Axios.get("/user/validate")
            return res.data === "true"
        }
        if (!permissions) {
            // 线上环境判断是否登录
            return <Redirect to={'/login'} />;
        }
        return component;
    };
    
    const initstate = initWysiwygState()
    const initFileState: FileState = {
        fileList: [],
        programs: {},
        scripts: {},
        initialized: false
    }
    const[wstate, setState] = useState(initstate)
    const[fstate, setFileState] = useState(initFileState)
    function initWysiwygState() {
        let msg = ""
        let blocksFromHtml = htmlToDraft(msg);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        return {
            editorContent: msg,
            contentState: convertToRaw(contentState),
            editorState: editorState,
            scriptPath: ""
        }
    }

    function changeStateWithString(str: string, path?: string) {
        let blocksFromHtml = htmlToDraft(str);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        setState({
            editorContent: str,
            contentState: convertToRaw(contentState),
            editorState: editorState,
            scriptPath: path || ""
        })
    }
    
    function changeScriptPath(path: string) {
        const curstate = {...wstate}
        curstate.scriptPath = path
        setState(curstate)
    }

    function changeState (state: any){
        setState(state) 
    }

    function changeProgramList(list: any) {
        const curstate = {...fstate}
        curstate.programs = {...list}
        setFileState(curstate)
    }

    function changeFileList(list: any) {
        const curstate = {...fstate}
        curstate.fileList = list
        setFileState(curstate)
    }

    function changeScriptList(list: any) {
        const curstate = {...fstate}
        curstate.scripts = list
        setFileState(curstate)
    }

    function changeProgramScriptList(programs: any, script: any, init: boolean) {
        const curstate = {...fstate}
        curstate.scripts = script
        curstate.programs = programs
        if(init) {
            curstate.initialized = true
        }
        setFileState(curstate)
    }
   
        return (
            <WysiwygContext.Provider value={{wstate, changeState, changeStateWithString, changeScriptPath}}>
            <FileContext.Provider value={{fstate, changeProgramList, changeFileList, changeScriptList, changeProgramScriptList}}>

            <Switch>
                
                {Object.keys(routesConfig).map(key =>
                    routesConfig[key].map((r: IFMenu) => {
                        const route = (r: IFMenuBase) => {
                            const Component = r.component && AllComponents[r.component];
                            return (
                                <Route
                                    key={r.route || r.key}
                                    exact
                                    path={r.route || r.key}
                                    render={props => {
                                        const reg = /\?\S*/g;
                                        // 匹配?及其以后字符串
                                        const queryParams = window.location.hash.match(reg);
                                        // 去除?的参数
                                        const { params } = props.match;
                                        Object.keys(params).forEach(key => {
                                            params[key] =
                                                params[key] && params[key].replace(reg, '');
                                        });
                                        props.match.params = { ...params };
                                        const merge = {
                                            ...props,
                                            query: queryParams
                                                ? queryString.parse(queryParams[0])
                                                : {},
                                        };
                                        // 重新包装组件
                                        const wrappedComponent = (
                                            <DocumentTitle title={r.title}>
                                                <Component {...merge} />
                                            </DocumentTitle>
                                        );
                                        return requireLogin(wrappedComponent);
                                    }}
                                />
                            );
                        };
                        return r.component
                            ? route(r)
                            : r.subs && r.subs.map((r: IFMenuBase) => route(r));
                    })
                )}

            </Switch>
            </FileContext.Provider>
            </WysiwygContext.Provider>
                
            
        );
}

