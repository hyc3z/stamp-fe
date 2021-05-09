/**
 * Created by hao.cheng on 2017/4/16.
 */
import React, { Dispatch, useContext, useRef, useState } from 'react';
import { Table, Icon, Button, message } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { Row, Col, Card } from 'antd';
import { DatePicker } from 'antd';
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
import { RangePickerValue } from 'antd/lib/date-picker/interface';
import { getCurrentTimeStamp, parseRangePickerValue } from '../../utils';

const { RangePicker } = DatePicker;

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

function renderTaxTableHeader(onChange: (dates: RangePickerValue, dateStrings: [string, string]) => void): JSX.Element {
    return (
        <>
        <Row>
            <Col span={2}>
                {"计费报表"}
            </Col>
            <Col span={4} offset={18}>
                <RangePicker onChange={onChange}/>
            </Col>
        </Row>
        </>
    )
}
function RenderTaxTable(props: TaxProps) {
    const [init, updateInit] = useState(false);
    const [startDate, setStartDate] = useState<string>("0");
    const [endDate, setEndDate] = useState<string>(getCurrentTimeStamp());
    if (!init) {
        getTaxData(startDate, endDate).then((taxes) => {
            props.setTaxes(taxes)
        });
        updateInit(true);
    }

    function onDateChange (dates: RangePickerValue, dateStrings: [string, string]): void {
        const [desiredStartDate, desiredEndDate] = parseRangePickerValue(dates)
        setStartDate(desiredStartDate)
        setEndDate(desiredEndDate)
    }
    return (
        <div className="gutter-example">
            <BreadcrumbCustom first="集群管理" second="计费报表" />
            <div className="gutter-box">
                <Card title={renderTaxTableHeader(onDateChange)} bordered={false}>
                    <Table columns={columns} dataSource={props.taxes} scroll={{ x: 300 }} />
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
