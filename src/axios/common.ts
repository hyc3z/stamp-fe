import Axios, { AxiosResponse } from 'axios';
import { TPartition } from '../typings/partition';
import { TTax } from '../typings/tax';

export async function getPartitionData(): Promise<TPartition[]> {
    const data = await Axios.get('/cluster/partitions').catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TPartition[]>)?.data ?? [];
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