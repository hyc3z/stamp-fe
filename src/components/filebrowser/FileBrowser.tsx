import { FileActionHandler, ChonkyActions,FullFileBrowser } from 'chonky';
// import { VFSBrowser } from './VFSBrowser'
import React from 'react';
import Axios from 'axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Form, Upload, Button, Icon, message } from 'antd';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined'
import qs from 'qs'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import FileManager from 'devextreme-react/file-manager'
import contextMenu from 'devextreme-react/context-menu';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Wysiwyg from '../ui/Wysiwyg'
interface FBState{
    programs: {},
    scripts: {},
} 
class MyFileBrowser extends React.Component<RouteComponentProps, FBState>{
    // for Chonky
    files = [
        {id: 'dir_script', name: '脚本文件夹', isDir: true, openable: true},
        {id: 'dir_exec', name: '程序文件夹', isDir: true, openable: true},
    ];
    folderChainProgram = [
        { id: 'fcp', name: '程序文件' },
    ];
    folderChainScript = [
        { id: 'fcs', name: '脚本文件' },
    ];
    // ------
    // customized FB menu devExtreme
    scriptMenu = {
        items: [
            {name: 'edit_script', text: '编辑脚本'},
            {name: 'download_script', text: '下载脚本'},
        ]
    }
    programMenu = {
        items:[
            {name: 'download_program',text: '下载程序'},
        ]
    }
    // customized FB menu action devExtreme
    handleClickProgram = (data: any) => {
        console.log(data)
    }

    handleClickScript = async (data: any) => {
        if(data.itemData.text == "编辑脚本") {
            const item = data.fileSystemItem
            if(item.isDirectory) {
                message.error("无法编辑脚本")
                return
            }
            const path = item.path
            const sd = await this.getscriptData(path)
            localStorage.setItem("stamp-script-edit", JSON.stringify(sd))
            localStorage.setItem("stamp-edit-path", path)

            this.props.history.push('/hpc/script/edit')
        }
    }

    fileList:any[] = [];
    constructor(props: any){
        super(props)
        this.state = {
            programs: {},
            scripts: {},
        }
        this.updateProgramfiles()
        this.updateScriptfiles()
    }
    getscriptData = (path: string) => {
        return Axios.get("/file/getScript/", {params : {
            "path": `${path}`,
        }
    }).then(data => {return data.data})
    }
    handleAction: FileActionHandler = (data) => {
        if (data.id === ChonkyActions.UploadFiles.id) {
            console.log(data)
        } 
    };
    updateProgramfiles = async () => {
        await Axios.get("/file/program").then(data => {this.setState({programs: data.data})})
    }
    updateScriptfiles = async () => {
        await Axios.get("/file/script").then(data => {this.setState({scripts: data.data})})
    }
    handleFileChange = ({file, fileList}: {file:any, fileList:any}) => { //处理文件change，保证用户选择的文件只有一个
        console.log("ckpt",file,fileList)
        this.fileList = fileList.length? [fileList[fileList.length - 1]] : []
    }
    
    myFileActions = [
        ChonkyActions.DownloadFiles,
    ];

    handleUploadProgram = (data:any) => {
     
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
            this.updateProgramfiles()
        }).catch((err) =>{
            message.error("上传失败")
            console.log(err)
        }).finally(() =>{
        })
    }

    handleUploadScript = (data:any) => {
        
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
            this.updateScriptfiles()
        }).catch((err) =>{
            message.error("上传失败")
            console.log(err)
        }).finally(() =>{
        })
    }
  
    render() {
        return (
            <div>
                <BreadcrumbCustom first="文件管理" />
                <Card title="文件管理" bordered={false}>
                    <Row gutter={24}>
                    <Col span={12}>
                    {/* <FullFileBrowser folderChain={this.folderChainProgram} files={this.state.programs} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                    <FileManager rootFolderName={"程序文件夹"} contextMenu={this.programMenu} onContextMenuItemClick={this.handleClickProgram} fileSystemProvider={this.state.programs}/>
                        </Col>
                        <Col span={12}>
                    <FileManager rootFolderName={"脚本文件夹"} contextMenu={this.scriptMenu} onContextMenuItemClick={this.handleClickScript} fileSystemProvider={this.state.scripts}/>
                    {/* <FullFileBrowser folderChain={this.folderChainScript} files={this.state.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/> */}
                        </Col>
                    </Row>
                    <p></p>
                    <Row gutter={24}>
                        <Col span={5}></Col>
                        <Col span={7}>
                        <Upload
                            showUploadList = {false}
                            customRequest = {this.handleUploadProgram}
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
                        customRequest = {this.handleUploadScript}
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
    }
};

export default withRouter(MyFileBrowser);