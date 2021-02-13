import { FileActionHandler, ChonkyActions,FullFileBrowser } from 'chonky';
// import { VFSBrowser } from './VFSBrowser'
import React, { useContext } from 'react';
import Axios from 'axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Form, Upload, Button, Icon, message } from 'antd';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined'
import qs from 'qs'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import FileManager from 'devextreme-react/file-manager'
import contextMenu from 'devextreme-react/context-menu';
import Wysiwyg from '../ui/Wysiwyg'
import WysiwygContext from '../../context/WysiwigContext';
import FileContext from '../../context/FileContext';
import { useHistory } from 'react-router-dom'
// import { withRouter, RouteComponentProps } from 'react-router-dom';


function MyFileBrowser (){

    let history = useHistory();
    // for Chonky
    const files = [
        {id: 'dir_script', name: '脚本文件夹', isDir: true, openable: true},
        {id: 'dir_exec', name: '程序文件夹', isDir: true, openable: true},
    ];
    const folderChainProgram = [
        { id: 'fcp', name: '程序文件' },
    ];
    const folderChainScript = [
        { id: 'fcs', name: '脚本文件' },
    ];
    // ------
    // customized FB menu devExtreme
    
    const scriptMenu = {
        items: [
            {name: 'edit_script', text: '编辑脚本'},
            {name: 'download_script', text: '下载脚本'},
            {name: 'create_task_via_script', text: '创建任务'}
        ]
    }
    const programMenu = {
        items:[
            {name: 'download_program',text: '下载程序'},
        ]
    }
    const {wstate, changeState, changeStateWithString} = useContext(WysiwygContext)
    const {fstate, changeProgramList, changeFileList, changeScriptList, changeProgramScriptList} = useContext(FileContext)

    // customized FB menu action devExtreme
    const handleClickProgram = (data: any) => {
        console.log(data)
    }

    const handleClickScript = async (data: any) => {
        if(data.itemData.text == "编辑脚本") {
            const item = data.fileSystemItem
            if(item.isDirectory) {
                message.error("无法编辑脚本")
                return
            }
            const path = item.path
            const sd = await getscriptData(path)
            history.push('/hpc/script/edit')
            changeStateWithString(sd["message"])
        }
    }

    
    const getscriptData = (path: string) => {
        return Axios.get("/file/getScript/", {params : {
            "path": `${path}`,
        }
    }).then(data => {return data.data})
    }
    
    const updateProgramfiles = async () => {
        await Axios.get("/file/program").then(data => {return changeProgramList(data.data)})
    }
    const updateScriptfiles = async () => {
        await Axios.get("/file/script").then(data => {return changeScriptList(data.data)})
    }

    const updateFiles = async () => {
        
        const p = await Axios.get("/file/program").then(data => {return data.data})
        const s = await Axios.get("/file/script").then(data => {return data.data})
        return changeProgramScriptList(p, s, true);
    }

    const handleFileChange = ({file, fileList}: {file:any, fileList:any}) => { //处理文件change，保证用户选择的文件只有一个
        console.log("ckpt",file,fileList)
        fileList = fileList.length? [fileList[fileList.length - 1]] : []
    }
    
    const handleUploadProgram = (data:any) => {
     
        const formData = new FormData()
        formData.append('file', data.file)
     
        Axios({
            method: 'POST',
            url: 'file/program',
            data: formData,
            headers: { 
                "Content-Type": "multipart/form-data",
            }
        }).then(({data}) => {
            message.success("上传成功")
            console.log(data)
            updateProgramfiles()
        }).catch((err) =>{
            message.error("上传失败")
            console.log(err)
        }).finally(() =>{
        })
    }

    const handleUploadScript = (data:any) => {
        
        const formData = new FormData()
        formData.append('file', data.file)
     
        
     
        Axios({
            method: 'POST',
            url: 'file/script',
            data: formData,
            headers: { 
                "Content-Type": "multipart/form-data",
            }
        }).then(({data}) => {
            message.success("上传成功")
            console.log(data)
            updateScriptfiles()
        }).catch((err) =>{
            message.error("上传失败")
            console.log(err)
        }).finally(() =>{
        })
    }
  
    if(!fstate.initialized){
        updateFiles()
    }
        return (
            <div>
                <BreadcrumbCustom first="文件管理" />
                <Card title="文件管理" bordered={false}>
                    <Row gutter={24}>
                    <Col span={12}>
                    {/* <FullFileBrowser folderChain={this.folderChainProgram} files={this.state.programs} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                    <FileManager rootFolderName={"程序文件夹"} contextMenu={programMenu} onContextMenuItemClick={handleClickProgram} fileSystemProvider={fstate.programs}/>
                        </Col>
                        <Col span={12}>
                    <FileManager rootFolderName={"脚本文件夹"} contextMenu={scriptMenu} onContextMenuItemClick={handleClickScript} fileSystemProvider={fstate.scripts}/>
                    {/* <FullFileBrowser folderChain={this.folderChainScript} files={this.state.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                        </Col>
                    </Row>
                    <p></p>
                    <Row gutter={24}>
                        <Col span={5}></Col>
                        <Col span={7}>
                        <Upload
                            showUploadList = {false}
                            customRequest = {handleUploadProgram}
                        >
                        <Button >
                            <CloudUploadOutlined translate={"default"}/>上传程序
                        </Button>
                        </Upload>
                    </Col>
                    <Col span={5}></Col>
                    <Col span={7}>
                    <Upload
                        showUploadList = {false}
                        customRequest = {handleUploadScript}
                    >
                      <Button>
                        <CloudUploadOutlined translate={"default"}/>上传脚本
                      </Button>
                    </Upload>
                    </Col>
                        </Row>
                </Card>
            </div>
        )
};

export default MyFileBrowser;