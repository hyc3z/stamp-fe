/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { Dispatch, useContext, useRef, useState } from 'react';
import { Table, Icon, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Card } from 'antd';
import StopOutlined from '@ant-design/icons/StopOutlined';
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined';
import JobListContext from '../../context/JobListContext';
import Axios from 'axios';
import dateformat from 'dateformat';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { TPartition } from '../../typings/partition';
import { changePartition, PartitionActionType } from '../../store/action/partition';
import { connect } from 'react-redux';
import { TReduxAction } from '../../common/const';
import { AppDispatch, RootState } from '../../store';
import { PartitionTableAttributes } from '../../common/const/partition';
import { useAppDispatch } from '../../App';
import { getPartitionData } from '../../axios/common';
interface PartitionProps {
    partitions: TPartition[];
    setPartitions: Function;
}
const columns: ColumnProps<any>[] = [
    { title: '分区名称', dataIndex: 'name', key: '0' },
    { title: '核心总数', dataIndex: 'total_cpus', key: '1' },
    { title: '节点总数', dataIndex: 'total_nodes', key: '2' },
];

function RenderPartitionTable(props: PartitionProps) {
    const [init, updateInit] = useState(false);

    if (!init) {
        getPartitionData().then((partitions) => props.setPartitions(partitions));
        updateInit(true);
    }
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="任务管理" second="队列管理" />
            <div className="gutter-box">
                <Card title="队列管理" bordered={false}>
                    <Table columns={columns} dataSource={props.partitions} scroll={{ x: 1300 }} />
                </Card>
            </div>
        </div>
    );
}

function mapStateToProps(state: RootState): Pick<PartitionProps, 'partitions'> {
    return {
        partitions: [...state.Partition.partitions].map(
            (partition: TPartition): TPartition => {
                const newItem: TPartition = {} as TPartition;
                PartitionTableAttributes.forEach((attribute: string) => {
                    Object.assign(newItem, {
                        [`${attribute}`]: partition[attribute as keyof TPartition],
                    });
                });
                return newItem;
            }
        ),
    };
}
function mapDispatchToProps(
    dispatch: Dispatch<TReduxAction>
): Pick<PartitionProps, 'setPartitions'> {
    return {
        setPartitions: (partitions: TPartition[]) => {
            dispatch(changePartition(partitions));
        },
    };
}
const PartitionTable = connect(mapStateToProps, mapDispatchToProps)(RenderPartitionTable);

export default PartitionTable;
