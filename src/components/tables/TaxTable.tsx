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
import { TTax } from '../../typings/tax';
import { changeTax, TaxActionType } from '../../store/action/tax';
import { connect } from 'react-redux';
import { TReduxAction } from '../../common/const';
import { AppDispatch, RootState } from '../../store';
import { TaxTableAttributes } from '../../common/const/tax';
import { useAppDispatch } from '../../App';
import { getTaxData } from '../../axios/common';
interface TaxProps {
    taxes: TTax[];
    setTaxes: Function;
}
const columns: ColumnProps<any>[] = [
    { title: '用户名称', dataIndex: 'user_name', key: '0' },
    { title: '任务总数', dataIndex: 'total_tasks', key: '1' },
    { title: '核时数', dataIndex: 'total_corehours', key: '2' },
    { title: '总费用', dataIndex: 'total_cost', key: '3' },
];

function RenderTaxTable(props: TaxProps) {
    const [init, updateInit] = useState(false);

    if (!init) {
        getTaxData("0", "1617175223").then((taxes) => {
            props.setTaxes(taxes)
        });
        updateInit(true);
    }
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="集群管理" second="计费报表" />
            <div className="gutter-box">
                <Card title="计费报表" bordered={false}>
                    <Table columns={columns} dataSource={props.taxes} scroll={{ x: 1300 }} />
                </Card>
            </div>
        </div>
    );
}

function mapStateToProps(state: RootState): Pick<TaxProps, 'taxes'> {
    return {
        taxes: [...state.Tax.taxes].map(
            (tax: TTax): TTax => {
                const newItem: TTax = {} as TTax;
                TaxTableAttributes.forEach((attribute: string) => {
                    Object.assign(newItem, {
                        [`${attribute}`]: tax[attribute as keyof TTax],
                    });
                });
                return newItem;
            }
        ),
    };
}
function mapDispatchToProps(
    dispatch: Dispatch<TReduxAction>
): Pick<TaxProps, 'setTaxes'> {
    return {
        setTaxes: (taxes: TTax[]) => {
            dispatch(changeTax(taxes));
        },
    };
}
const TaxTable = connect(mapStateToProps, mapDispatchToProps)(RenderTaxTable);

export default TaxTable;
