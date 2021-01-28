import { FileActionHandler, ChonkyActions,FullFileBrowser } from 'chonky';
import React from 'react';
import Axios from 'axios';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { Row, Col, Card, Form, Upload, Button, Icon, message } from 'antd';
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined'
export default class MyFileBrowser extends React.Component {
    files = [
        {id: 'dir_script', name: '脚本文件夹', isDir: true, openable: true},
        {id: 'dir_exec', name: '程序文件夹', isDir: true, openable: true},
    ];
    programs = [
        {id: 'demo_program', name: 'mpi.out',  openable: true},

    ]
    scripts = [
        {id: 'demo_script', name: 'mpi-task.sbatch',  openable: true},

    ]

    folderChainProgram = [
        { id: 'fcp', name: '程序文件' },
    ];
    folderChainScript = [
        { id: 'fcs', name: '脚本文件' },
    ];
    fileList:any[] = [];
    constructor(props: any){
        super(props)
    }

    handleAction: FileActionHandler = (data) => {
        if (data.id === ChonkyActions.UploadFiles.id) {
            console.log(data)
        } 
    };

    handleFileChange = ({file, fileList}: {file:any, fileList:any}) => { //处理文件change，保证用户选择的文件只有一个
        console.log("ckpt",file,fileList)
        this.fileList = fileList.length? [fileList[fileList.length - 1]] : []
    }
    
    myFileActions = [
        ChonkyActions.DownloadFiles,
    ];

    handleUploadProgram = () => {
        if(!this.fileList.length) {
            message.info("请选择要上传的程序")
            return
        }
     
        const formData = new FormData()
        formData.append('file', this.fileList[0].originFileObj)
     
        this.setState({
            uploading: true
        })
     
        Axios.defaults.baseURL='https://jsonplaceholder.typicode.com/'
        Axios({
            method: 'post',
            url: 'posts',
            data: formData,
            headers: { "Content-Type": "multipart/form-data"}
        }).then(({data}) => {
            message.success("上传成功")
            console.log(data)
        }).catch((err) =>{
            console.log(err)
        }).finally(() =>{
            this.setState({
                uploading: false
            })
        })
    }

    handleUploadScript = () => {
        if(!this.fileList.length) {
            message.info("请选择要上传的脚本")
            return
        }
     
        const formData = new FormData()
        formData.append('file', this.fileList[0].originFileObj)
     
        this.setState({
            uploading: true
        })
     
        Axios.defaults.baseURL='https://jsonplaceholder.typicode.com/'
        Axios({
            method: 'post',
            url: 'posts',
            data: formData,
            headers: { "Content-Type": "multipart/form-data"}
        }).then(({data}) => {
            message.success("上传成功")
            console.log(data)
        }).catch((err) =>{
            console.log(err)
        }).finally(() =>{
            this.setState({
                uploading: false
            })
        })
    }

    render() {
        return (
            <div>
                <BreadcrumbCustom first="文件管理" />
                <Card title="文件管理" bordered={false}>
                    <Row gutter={24}>
                    <Col span={12}>
                    <FullFileBrowser folderChain={this.folderChainProgram} files={this.programs} fileActions={this.myFileActions} onFileAction={this.handleAction}/>
                        </Col>
                        <Col span={12}>
                    <FullFileBrowser folderChain={this.folderChainScript} files={this.scripts} fileActions={this.myFileActions} onFileAction={this.handleAction}/>
                        </Col>
                    </Row>
                    <p></p>
                    <Row gutter={24}>
                        <Col span={5}></Col>
                        <Col span={7}>
                        <Upload
                            customRequest={this.handleUploadProgram}
                            fileList = {this.fileList}
                            beforeUpload={(f, fList) => false}
                            onChange = {this.handleFileChange}
                        >
                        <Button >
                            <CloudUploadOutlined translate={"default"}/>上传程序
                        </Button>
                        </Upload>
                    </Col>
                    <Col span={5}></Col>
                    <Col span={7}>
                    <Upload
                        fileList = {this.fileList}
                        onChange = {this.handleFileChange}
                        beforeUpload={(f, fList) => false}
                        customRequest={this.handleUploadScript}
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