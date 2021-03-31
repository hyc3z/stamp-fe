import Axios, { AxiosResponse } from 'axios';
import { TPartition } from '../typings/partition';

export async function getPartitionData(): Promise<TPartition[]> {
    const data = await Axios.get('/cluster/partitions').catch((err) => {
        console.log(err);
    });
    return (data as AxiosResponse<TPartition[]>).data;
}
