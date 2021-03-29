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
import BreadcrumbCustom from '../BreadcrumbCustom';

const columns: ColumnProps<any>[] = [
    { title: '分区名称', dataIndex: 'name', key: '0' },
    { title: '核心总数', dataIndex: 'total_cpus', key: '1' },
    { title: '节点总数', dataIndex: 'total_nodes', key: '2' },
    // { title: 'Column 5', dataIndex: 'address', key: '5' },
    // { title: 'Column 6', dataIndex: 'address', key: '6' },
    // { title: 'Column 7', dataIndex: 'address', key: '7' },
    // { title: 'Column 8', dataIndex: 'address', key: '8' },
    // {
    //     title: '操作',
    //     key: 'operation',
    //     fixed: 'right',
    //     width: 120,
    //     render: (text: any, record: any) => (
    //         <span>
    //             <Row gutter={24}>
    //                 <Col span={11}>
    //                     <Button onClick={() => {}}>
    //                     <StopOutlined translate={"default"}/>停止任务</Button>
    //                 </Col>
    //                 {/* <Col span={11}>
    //                 <Button>
    //                 <InfoCircleOutlined translate={"default"}/>任务详情
    //                 </Button>
    //                 </Col> */}
    //             </Row>
    //         </span>
    //     ),
    // },
    
];



function PartitionTable() {
    
    const {sjlstate, updateJobList} = useContext(JobListContext)
    const [init, updateInit] = useState(false)
    async function getData() {
            Axios.get("/cluster/partitions").then(
                data => {
                    let res = data.data
                    console.log(res)
                    updateJobList(res)
                }
            )
    }
    if(!init){
        getData()
        updateInit(true)
    }
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="任务管理" second="队列管理" />
        <Table columns={columns} dataSource={sjlstate} scroll={{ x: 1300 }} />
        </div>
    )
};

export default PartitionTable;
