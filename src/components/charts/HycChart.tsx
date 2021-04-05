/**
 * Created by hao.cheng on 2017/4/21.
 */
import { Row, Col, Card } from 'antd';
import React, { Dispatch, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { TReduxAction } from '../../common/const';
import { CpuUsageAttributes, TCpuUsage, TMetrics } from '../../common/const/metrics';
import { RootState } from '../../store';
import { changeCpuUsage } from '../../store/action/metrics';
import { changePartition } from '../../store/action/partition';
import { TPartition } from '../../typings/partition';
import BreadcrumbCustom from '../BreadcrumbCustom';
import { connect } from 'react-redux';
import { getMetricsData } from '../../axios/common';
import ReactECharts from 'echarts-for-react';
const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

interface MyChartProps {
    cpuUsage: TCpuUsage[];
    setMetrics: Function;
}

function RechartsBarChart(props:MyChartProps): JSX.Element{
    
    useEffect(() => {
        async function setMetricsData() {
            const metrics = await getMetricsData()
            props.setMetrics(metrics)
        } 
        setMetricsData()
    }, [])
    const option2 = {
        title: {
          text: '阶梯瀑布图',
          subtext: 'From ExcelHome',
          sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {      // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'    // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['支出','收入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type : 'category',
          splitLine: {show:false},
          data :  ["11月1日", "11月2日", "11月3日", "11月4日", "11月5日", "11月6日", "11月7日", "11月8日", "11月9日", "11月10日", "11月11日"]
        },
        yAxis: {
          type : 'value'
        },
        series: [
          {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
          }
        ]
    }
    console.log(props.cpuUsage)
    const option = {
        title: {
          text: 'Cpu负载情况'
        },
        tooltip: {},
        legend: {
          data:['总核心数', '负载']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
        xAxis: {
            type: 'category',
            splitLine: {show:false},
            data: props.cpuUsage.map((cpuUsage: TCpuUsage) => { return cpuUsage.name} )
        },
        yAxis: {
            type: 'value'
        },
        series: [{
          name: '空闲核心数',
          type: 'bar',
          stack: '总量',
          barWidth: 50,
          data: props.cpuUsage.map((cpuUsage: TCpuUsage) => { return cpuUsage.cpus - cpuUsage.cpu_load} )
        },
        {
            name: '负载核心数',
            type: 'bar',
            stack: '总量',
            barWidth: 50,
            data: props.cpuUsage.map((cpuUsage: TCpuUsage) => { return cpuUsage.cpu_load} )
          }
        ]
      };
    return (
        <div className="gutter-example">
                    <BreadcrumbCustom first="集群管理" second="集群监控" />
    
                    <Row gutter={16}>
                        <Col className="gutter-row" md={24}>
                            <div className="gutter-box">
                                <Card title="集群负载" bordered={false}>
                                
                            <ReactECharts
                                option={option}
                                style={{ height: 400 }}
                                opts={{ renderer: 'svg' }}
                                
                            />;
                                </Card>
                            </div>
                        </Col>
                    </Row>
                    </div>
        
    );
}

function mapStateToProps(state: RootState): Pick<MyChartProps, 'cpuUsage'> {
    return {
        cpuUsage: [...state.metrics.cpuUsage].map(
            (cpuUsage: TCpuUsage): TCpuUsage => {
                const newItem: TCpuUsage = {} as TCpuUsage;
                CpuUsageAttributes.forEach((attribute: string) => {
                    if(attribute === 'cpu_load'){
                        Object.assign(newItem, {
                            [`${attribute}`]: (cpuUsage.cpu_load < cpuUsage.cpus ? cpuUsage.cpu_load : 0) / 100,
                        })
                    } else {
                        Object.assign(newItem, {
                            [`${attribute}`]: cpuUsage[attribute as keyof TCpuUsage],
                        });
                    }
                });
                return newItem;
            }
        ),
    };
}
function mapDispatchToProps(
    dispatch: Dispatch<TReduxAction>
): Pick<MyChartProps, 'setMetrics'> {
    return {
        setMetrics: (metrics: TMetrics) => {
            dispatch(changeCpuUsage(metrics.cpuUsage));
        },
    };
}

const HycChart = connect(mapStateToProps, mapDispatchToProps)(RechartsBarChart);

export default HycChart;
