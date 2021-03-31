/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from 'react';
import { Row, Col, Card } from 'antd';
import FixedTable from './FixedTableScript';
import ExpandedTable from './ExpandedTable';
import EditableTable from './EditableTable';
import BreadcrumbCustom from '../BreadcrumbCustom';

class ScriptTables extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="脚本管理" second="脚本列表" />
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="脚本列表" bordered={false}>
                                <FixedTable />
                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="gutter-row" md={12}>
                        {/* <div className="gutter-box">
                            <Card title="可展开" bordered={false}>
                                <ExpandedTable />
                            </Card>
                        </div> */}
                    </Col>
                    <Col className="gutter-row" md={12}>
                        {/* <div className="gutter-box">
                            <Card title="可编辑" bordered={false}>
                                <EditableTable />
                            </Card>
                        </div> */}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ScriptTables;
