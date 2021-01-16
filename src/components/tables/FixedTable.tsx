/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Table, Icon, Button } from 'antd';
import { ColumnProps } from 'antd/lib/table';

const columns: ColumnProps<any>[] = [
    { title: '任务名称', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
    { title: '运行状态', width: 100, dataIndex: 'state', key: 'state', fixed: 'left' },
    { title: '运行时长', dataIndex: 'elapsed', key: '1' },
    { title: '开始时间', dataIndex: 'start_time', key: '2' },
    { title: '资源类型', dataIndex: 'res_type', key: '3' },
    { title: '资源数量', dataIndex: 'res_amount', key: '4' },
    // { title: 'Column 5', dataIndex: 'address', key: '5' },
    // { title: 'Column 6', dataIndex: 'address', key: '6' },
    // { title: 'Column 7', dataIndex: 'address', key: '7' },
    // { title: 'Column 8', dataIndex: 'address', key: '8' },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text: any, record: any) => (
            <span>
                <Button>Action 一 {record.name}</Button>
                <span className="ant-divider" />
                <Button>Delete</Button>
                <span className="ant-divider" />
                <Button className="ant-dropdown-link">
                    More actions <Icon type="down" />
                </Button>
            </span>
        ),
    },
    
];

const data = [
    {
        key: '1',
        name: 'MPI-1',
        elapsed: "24h",
        start_time: '2021-01-01:000000',
        res_type:'CPU',
        res_amount:'2',
    },
    {
        key: '1',
        name: 'MPI-2',
        elapsed: "24h",
        start_time: '2021-01-01:000000',
        res_type:'CPU',
        res_amount:'4',
    },
];

const FixedTable = () => <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />;

export default FixedTable;
