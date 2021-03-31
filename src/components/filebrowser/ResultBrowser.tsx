import { FileActionHandler, ChonkyActions, FullFileBrowser } from 'chonky';
// import { VFSBrowser } from './VFSBrowser'
import React, { useContext, useState } from 'react';
import Axios from 'axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Form, Upload, Button, Icon, message } from 'antd';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import qs from 'qs';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import FileManager from 'devextreme-react/file-manager';
import contextMenu from 'devextreme-react/context-menu';
import Wysiwyg from '../ui/Wysiwyg';
import WysiwygContext from '../../context/WysiwigContext';
import FileContext from '../../context/FileContext';
import { useHistory } from 'react-router-dom';
import JobContext from '../../context/JobCreateContext';
import { CommonSeriesSettings } from 'devextreme-react/chart';
// import { withRouter, RouteComponentProps } from 'react-router-dom';

type resultState = {
    resultList: any[];
    initialized: boolean;
};

function MyResultBrowser() {
    let history = useHistory();
    const initState = {
        resultList: [],
        initialized: false,
    };
    const [fstate, setFstate] = useState(initState);
    const resultMenu = {
        items: [{ name: 'get_result', text: '下载结果' }],
    };

    const handleClickResult = async (data: any) => {
        if (data.itemData.text == '下载结果') {
            const item = data.fileSystemItem;
            if (item.isDirectory) {
                message.error('无法下载结果');
                return;
            }
            const path = item.path;
            const sd = await getscriptData(path);
            history.push('/hpc/result/download');
        }
    };
    function refreshFileBrowser() {
        const curstate = { ...fstate };
        curstate.initialized = false;
        setFstate(curstate);
    }
    const handleToolbarClick = async (params: any) => {
        if (params.itemData == 'refresh') {
            refreshFileBrowser();
        }
    };

    const deleteFile = (path: string, type: string) => {
        return Axios.get('/file/delete' + type, {
            params: {
                path: `${path}`,
            },
        })
            .then((data) => {
                return data.data;
            })
            .catch((err) => {
                message.error('删除失败');
                console.log(err);
            });
    };
    const getscriptData = (path: string) => {
        return Axios.get('/file/getScript/', {
            params: {
                path: `${path}`,
            },
        })
            .then((data) => {
                return data.data;
            })
            .catch((err) => {
                message.error('读取脚本失败');
                console.log(err);
            });
    };

    const updateFiles = async () => {
        const p = await Axios.get('/file/result').then((data) => {
            return data.data;
        });
        const curstate = { ...fstate };
        curstate.resultList = p;
        setFstate(curstate);
    };

    const handleFileChange = ({ file, fileList }: { file: any; fileList: any }) => {
        //处理文件change，保证用户选择的文件只有一个
        console.log('ckpt', file, fileList);
        fileList = fileList.length ? [fileList[fileList.length - 1]] : [];
    };

    if (!fstate.initialized) {
        updateFiles();
    }
    return (
        <div>
            <BreadcrumbCustom first="文件管理" />
            <Card title="文件管理" bordered={false}>
                <Row gutter={24}>
                    <FileManager
                        rootFolderName={'结果文件夹'}
                        contextMenu={resultMenu}
                        onContextMenuItemClick={handleClickResult}
                        fileSystemProvider={fstate.resultList}
                        onToolbarItemClick={handleToolbarClick}
                    />
                    {/* <FullFileBrowser folderChain={this.folderChainScript} files={this.state.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                </Row>
                <p></p>
                <Row gutter={24}>
                    <Col span={5}></Col>
                    <Col span={7}></Col>
                    <Col span={5}></Col>
                    <Col span={7}></Col>
                </Row>
            </Card>
        </div>
    );
}

export default MyResultBrowser;
