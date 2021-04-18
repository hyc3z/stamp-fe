/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { Dispatch, useContext, useEffect, useRef, useState } from 'react';
import { Table, Icon, Button, message, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Card } from 'antd';
import SyncOutlined from '@ant-design/icons/SyncOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import JobListContext from '../../context/JobListContext';
import Axios from 'axios';
import dateformat from 'dateformat';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { TReduxAction } from '../../common/const';
import  store, { AppDispatch, RootState } from '../../store';
import { useAppDispatch } from '../../App';
import { getSlurmProcessData } from '../../axios/common';
import { TSlurmProcess } from '../../typings/slurmProcess';
import { changeSlurmProcess } from '../../store/action/slurmProcess';
interface SlurmProcessProps {
    slurmProcess: TSlurmProcess[];
    setSlurmProcess: Function;
}
function restartProcess(data: any) {
    Axios({
        url: `/cluster/restartProcess`,
        method: 'GET',
        headers: {
            'process-name': `${data.name}`,
        },
    }).then(() => {
        message.success('重启进程成功');
        getSlurmProcessData().then((slurmProcess: any) => {
            store.dispatch(changeSlurmProcess(slurmProcess))
        } )

    }).catch((err) => {
        message.error('重启进程失败');
        console.log(err);
    });
}
const columns: ColumnProps<any>[] = [
    { title: '进程名', dataIndex: 'name', key: '0' },
    { title: 'PID', dataIndex: 'pid', key: '1' },
    { title: '状态', dataIndex: 'status', key: '2',
        render: (text: any, record: any) => (
            <Tag style={{
                color: text === "active" ? "#99CC33" : "#FF0033",
                borderColor: text === "active" ? "#99CC33" : "#FF0033"
            }}>
                {text}
            </Tag>
        )
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 120,
        render: (text: any, record: any) => (
            <span>
                <Row gutter={24}>
                    <Col span={11}>
                        <Button
                            onClick={() => {
                                restartProcess(record);
                            }}
                        >
                            <SyncOutlined translate={'default'} />
                            重启进程
                        </Button>
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

function RenderSlurmProcessTable(props: SlurmProcessProps) {
    useEffect(() => {
        getSlurmProcessData().then((slurmProcess: any) => props.setSlurmProcess(slurmProcess));
    },[])
       
        
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="集群管理" second="slurm进程管理" />
            <div className="gutter-box">
                <Card title="slurm进程管理" bordered={false}>
                    <Table tableLayout="fixed" columns={columns} dataSource={props.slurmProcess ?? []} scroll={{ x: 300 }} />
                </Card>
            </div>
        </div>
    );
}

function mapStateToProps(state: RootState): Pick<SlurmProcessProps, 'slurmProcess'> {
    return {
        slurmProcess: [...state.SlurmProcess.slurmProcess].map(
            (slurmProcess: TSlurmProcess): TSlurmProcess => {
                return slurmProcess;
            }
        ),
    };
}
function mapDispatchToProps(
    dispatch: Dispatch<TReduxAction>
): Pick<SlurmProcessProps, 'setSlurmProcess'> {
    return {
        setSlurmProcess: (slurmProcess: TSlurmProcess[]) => {
            dispatch(changeSlurmProcess(slurmProcess));
        },
    };
}
const SlurmProcessTable = connect(mapStateToProps, mapDispatchToProps)(RenderSlurmProcessTable);

export default SlurmProcessTable;
