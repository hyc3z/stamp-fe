import { TReduxAction } from '../../common/const';
import { ACTION_CHANGE_SLURM_PROCESS } from '../../common/const/slurmProcess';
import { TSlurmProcess } from '../../typings/slurmProcess';
export const changeSlurmProcess = (slurmProcess: TSlurmProcess[]): TReduxAction => {
    return {
        type: ACTION_CHANGE_SLURM_PROCESS,
        payload: { slurmProcess },
    };
};

export type slurmProcessActionType = typeof changeSlurmProcess;
