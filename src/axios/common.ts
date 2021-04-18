import Axios, { AxiosResponse } from 'axios';
import { TMetrics } from '../common/const/metrics';
import { TPartition } from '../typings/partition';
import { TSlurmProcess } from '../typings/slurmProcess';
import { TTax } from '../typings/tax';

export async function getPartitionData(): Promise<TPartition[]> {
    const data = await Axios.get('/cluster/partitions').catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TPartition[]>)?.data ?? [];
}

export async function getMetricsData(): Promise<TMetrics[]> {
    const data = await Axios.get('/metrics/cluster').catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TMetrics[]>)?.data ?? [];
}
export async function getSlurmProcessData(): Promise<TSlurmProcess[]> {
    const data = await Axios.get('/cluster/process').catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TSlurmProcess[]>)?.data ?? [];
}
export async function getTaxData(startDate: string, endDate: string): Promise<TTax[]> {
    const data = await Axios.get('/metrics/tax', {
        headers: {
            "stamp_report_start_date": startDate,
            "stamp_report_end_date": endDate
        }
        }).catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TTax[]>)?.data ?? [];
}