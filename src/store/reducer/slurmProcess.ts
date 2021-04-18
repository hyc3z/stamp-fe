import { TReduxAction } from '../../common/const';
import { combineReducers } from 'redux';
import { ACTION_CHANGE_SLURM_PROCESS } from '../../common/const/slurmProcess';
import { TSlurmProcess } from '../../typings/slurmProcess';
const slurmProcess = (
    state: TSlurmProcess[] = [],
    action: TReduxAction
): TSlurmProcess[] | Partial<TSlurmProcess>[] => {
    switch (action.type) {
        case ACTION_CHANGE_SLURM_PROCESS: {
            return action.payload['slurmProcess'];
        }
        default: {
            return state;
        }
    }
};

export const SlurmProcess = combineReducers({
    slurmProcess,
});

export default SlurmProcess;
