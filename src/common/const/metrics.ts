export interface TCpuUsage {
    cpus: number;
    cpu_load: number;
    name: string;
}

export enum ECpuUsageActionType {
    CHANGE_CPU_USAGE,
}
export const CHANGE_CPU_USAGE = 'CHANGE_CPU_USAGE';

export interface TMetrics {
    cpuUsage: TCpuUsage[]
}

export const CpuUsageAttributes = ['cpus', 'cpu_load', 'name']