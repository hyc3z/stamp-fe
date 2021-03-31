import React, { useContext, useState } from 'react';
import Axios from 'axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Form, Upload, Button, Icon, message, Tabs } from 'antd';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
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
const { TabPane } = Tabs;

function MyFileBrowser() {
    let history = useHistory();
    // for Chonky
    const files = [
        { id: 'dir_script', name: '脚本文件夹', isDir: true, openable: true },
        { id: 'dir_exec', name: '程序文件夹', isDir: true, openable: true },
    ];
    const folderChainProgram = [{ id: 'fcp', name: '程序文件' }];
    const folderChainScript = [{ id: 'fcs', name: '脚本文件' }];
    // ------
    // customized FB menu devExtreme

    const scriptMenu = {
        items: [
            { name: 'edit_script', text: '编辑脚本' },
            { name: 'delete_script', text: '删除脚本' },
            { name: 'download_script', text: '下载脚本' },
            { name: 'create_task_via_script', text: '创建任务' },
        ],
    };
    const programMenu = {
        items: [{ name: 'delete_program', text: '删除程序' }],
    };
    const { wstate, changeState, changeStateWithString, changeScriptPath } = useContext(
        WysiwygContext
    );
    const {
        fstate,
        changeProgramList,
        changeFileList,
        changeScriptList,
        changeProgramScriptList,
        refreshFileBrowser,
    } = useContext(FileContext);
    const { jobState, changeJobScript, changeJobSpec, changeJobStatus } = useContext(JobContext);
    const [resultList, changeResultList] = useState([] as any[]);
    // customized FB menu action devExtreme
    const handleClickProgram = async (data: any) => {
        if (data.itemData.text == '删除程序') {
            const item = data.fileSystemItem;
            const path = item.path;
            const sd = await deleteFile(path, 'program');
            refreshFileBrowser();
        }
    };
    function changeScriptName(e: any) {
        const curScript = { ...jobState.jobScript };
        curScript.name = e;
        changeJobScript(curScript);
    }
    const handleClickScript = async (data: any) => {
        if (data.itemData.text == '编辑脚本') {
            const item = data.fileSystemItem;
            if (item.isDirectory) {
                message.error('无法编辑脚本');
                return;
            }
            const path = item.path;
            const sd = await getscriptData(path);
            history.push('/hpc/script/edit');
            changeStateWithString(sd['message'], path);
        }
        if (data.itemData.text == '删除脚本') {
            const item = data.fileSystemItem;
            const path = item.path;
            const sd = await deleteFile(path, 'script');
            refreshFileBrowser();
        }
        if (data.itemData.text == '下载脚本') {
            const item = data.fileSystemItem;
            const path = item.path;
            const sd = await downloadFile(path);

            refreshFileBrowser();
        }
        if (data.itemData.text == '创建任务') {
            const item = data.fileSystemItem;
            const path = item.path;
            changeScriptName(path);
            history.push('/hpc/task/taskCreate');
        }
    };

    const handleToolbarClickProgram = async (params: any) => {
        if (params.itemData == 'refresh') {
            refreshFileBrowser();
        }
    };
    const handleToolbarClickScript = async (params: any) => {
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

    const downloadFile = (path: string) => {
        Axios({
            url: `/file/download/${path}`,
            method: 'POST',
            responseType: 'blob',
        })
            .then((data) => {
                console.log(data.data);
                const url = window.URL.createObjectURL(new Blob([data.data]));
                // 再输入到 Blob 生成文件
                const link = document.createElement('a');
                // 指定生成的文件名
                link.href = url;
                link.setAttribute('download', path);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((err) => {
                message.error('下载失败');
                console.log(err);
            });
    };
    const getResultData = () => {
        return Axios.get('/file/result/')
            .then((data) => {
                console.log(data.data);
                changeResultList(data.data);
            })
            .catch((err) => {
                message.error('获取结果失败');
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

    const updateProgramfiles = async () => {
        await Axios.get('/file/program').then((data) => {
            return changeProgramList(data.data);
        });
    };
    const updateScriptfiles = async () => {
        await Axios.get('/file/script').then((data) => {
            return changeScriptList(data.data);
        });
    };

    const updateFiles = async () => {
        getResultData();
        const p = await Axios.get('/file/program').then((data) => {
            return data.data;
        });
        const s = await Axios.get('/file/script').then((data) => {
            return data.data;
        });
        return changeProgramScriptList(p, s, true);
    };

    const handleFileChange = ({ file, fileList }: { file: any; fileList: any }) => {
        //处理文件change，保证用户选择的文件只有一个
        console.log('ckpt', file, fileList);
        fileList = fileList.length ? [fileList[fileList.length - 1]] : [];
    };

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
            const sd = await downloadFile(path);
        }
    };

    const handleUploadProgram = (data: any) => {
        const formData = new FormData();
        formData.append('file', data.file);

        Axios({
            method: 'POST',
            url: 'file/program',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                message.success('上传成功');
                console.log(data);
                updateProgramfiles();
            })
            .catch((err) => {
                message.error('上传失败');
                console.log(err);
            })
            .finally(() => {
                refreshFileBrowser();
            });
    };

    const handleUploadScript = (data: any) => {
        const formData = new FormData();
        formData.append('file', data.file);

        Axios({
            method: 'POST',
            url: 'file/script',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(({ data }) => {
                message.success('上传成功');
                console.log(data);
                updateScriptfiles();
            })
            .catch((err) => {
                message.error('上传失败');
                console.log(err);
            })
            .finally(() => {
                refreshFileBrowser();
            });
    };

    if (!fstate.initialized) {
        updateFiles();
    }
    return (
        <div>
            <BreadcrumbCustom first="文件管理" />
            <Tabs
                defaultActiveKey="1"
                onChange={() => {
                    updateFiles();
                    getResultData();
                }}
            >
                <TabPane tab={'脚本'} key="1">
                    <Card title="脚本文件夹" bordered={false}>
                        <FileManager
                            rootFolderName={'脚本文件夹'}
                            contextMenu={scriptMenu}
                            onContextMenuItemClick={handleClickScript}
                            fileSystemProvider={fstate.scripts}
                            onToolbarItemClick={handleToolbarClickScript}
                        />
                        {/* <FullFileBrowser folderChain={this.folderChainScript} files={this.state.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                        <Upload showUploadList={false} customRequest={handleUploadScript}>
                            <Button>
                                <CloudUploadOutlined translate={'default'} />
                                上传脚本
                            </Button>
                        </Upload>
                    </Card>
                </TabPane>
                <TabPane tab="程序" key="2">
                    <Card title="文件管理" bordered={false}>
                        <FileManager
                            rootFolderName={'程序文件夹'}
                            contextMenu={programMenu}
                            onContextMenuItemClick={handleClickProgram}
                            fileSystemProvider={fstate.programs}
                            onToolbarItemClick={handleToolbarClickProgram}
                        />

                        <Upload showUploadList={false} customRequest={handleUploadProgram}>
                            <Button>
                                <CloudUploadOutlined translate={'default'} />
                                上传程序
                            </Button>
                        </Upload>
                    </Card>
                </TabPane>

                <TabPane tab={'运行结果'} key="3">
                    <Card title="结果文件夹" bordered={false}>
                        <FileManager
                            rootFolderName={'结果文件夹'}
                            contextMenu={resultMenu}
                            onContextMenuItemClick={handleClickResult}
                            fileSystemProvider={resultList}
                            onToolbarItemClick={() => {
                                getResultData();
                            }}
                        />
                        {/* <FullFileBrowser folderChain={this.folderChainScript} files={this.state.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default MyFileBrowser;
