import { TReduxAction } from '../../common/const';
import { CHANGE_CPU_USAGE, TCpuUsage } from '../../common/const/metrics';
export const changeCpuUsage = (cpuUsage: TCpuUsage[]): TReduxAction => {
    return {
        type: CHANGE_CPU_USAGE,
        payload: { cpuUsage },
    };
};

export type CpuUsageType = typeof changeCpuUsage;
