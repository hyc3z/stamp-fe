/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { useContext, useRef, useState } from 'react';
import { Table, Icon, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Card } from 'antd';
import StopOutlined from '@ant-design/icons/StopOutlined'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import JobListContext from '../../context/JobListContext';
import Axios from 'axios';
import dateformat from 'dateformat'
function stopJob(data: any) {
    Axios({
        url:`/task/task`,
        method: "DELETE",
        headers: { 
            "task-identifier": `${data.taskId}`,
        }
    }).catch(err => {
        message.error("停止任务失败")
        console.log(err)
    })
}
const columns: ColumnProps<any>[] = [
    { title: '任务序号', dataIndex: 'taskId', key: 'id' },
    { title: '任务名称', dataIndex: 'taskName', key: 'name' },
    { title: '运行状态', dataIndex: 'state.stateDescription', key: 'state' },
    { title: '开始时间', dataIndex: 'startTime', key: '1' },
    { title: '结束时间', dataIndex: 'finishTime', key: '2' },
    { title: '资源类型', dataIndex: 'resource.typeDescription', key: '3' },
    { title: '资源数量', dataIndex: 'resourceAmount', key: '4' },
    // { title: 'Column 5', dataIndex: 'address', key: '5' },
    // { title: 'Column 6', dataIndex: 'address', key: '6' },
    // { title: 'Column 7', dataIndex: 'address', key: '7' },
    // { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text: any, record: any) => (
            <span>
                <Row gutter={24}>
                    <Col span={11}>
                        <Button onClick={() => {stopJob(record)}}>
                        <StopOutlined translate={"default"}/>停止任务</Button>
                    </Col>
                    {/* <Col span={11}>
                    <Button>
                    <InfoCircleOutlined translate={"default"}/>任务详情
                    </Button>
                    </Col> */}
                </Row>
            </span>
        ),
    },
    
];



function FixedTable() {
    const {sjlstate, updateJobList} = useContext(JobListContext)
    const [init, updateInit] = useState(false)
    async function getData() {
            Axios.get("/task/tasks").then(
                data => {
                    let res = data.data
                    console.log(res)
                    for (let element of res) {
                        element.startTime = dateformat(element.startTime, "yyyy-mm-dd HH:MM:ss")
                        element.finishTime = dateformat(element.finishTime, "yyyy-mm-dd HH:MM:ss")
                    }
                    updateJobList(res)
                }
            )
    }
    if(!init){
        getData()
        updateInit(true)
    }
    return (
        <Table columns={columns} dataSource={sjlstate} scroll={{ x: 1300 }} />
    )
};

export default FixedTable;
