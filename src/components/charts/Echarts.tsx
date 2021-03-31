/**
 * Created by hao.cheng on 2017/4/17.
 */
import React from 'react';
import { Row, Col, Card } from 'antd';
import EchartsArea from './EchartsArea';
// import EchartsPie from './EchartsPie';
// import EchartsEffectScatter from './EchartsEffectScatter';
// import EchartsForce from './EchartsForce';
import BreadcrumbCustom from '../BreadcrumbCustom';

class Echarts extends React.Component {
    render() {
        return (
            <div className="gutter-example">
                <BreadcrumbCustom first="集群管理" second="集群监控" />

                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="集群负载" bordered={false}>
                                <EchartsArea />
                            </Card>
                        </div>
                    </Col>
                </Row>
                {/* 
                <Row gutter={16}>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="关系图" bordered={false}>
                                {/*<EchartsGraphnpm />*
                                <EchartsForce />
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row" md={12}>
                        <div className="gutter-box">
                            <Card title="饼图" bordered={false}>
                                <EchartsPie />
                            </Card>
                        </div>
                    </Col>
                </Row> 
            
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="散点图" bordered={false}>
                                <EchartsEffectScatter />
                            </Card>
                        </div>
                    </Col>
                </Row>
                                */}
            </div>
        );
    }
}

export default Echarts;
