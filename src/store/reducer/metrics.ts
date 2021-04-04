import { TReduxAction } from "../../common/const";
import { CHANGE_CPU_USAGE, TCpuUsage } from "../../common/const/metrics";
import { combineReducers } from 'redux';


const cpuUsage = (
    state: TCpuUsage[] = [],
    action: TReduxAction
):TCpuUsage[] | Partial<TCpuUsage[]> =>{
    switch(action.type) {
        case CHANGE_CPU_USAGE:{
            return action.payload['cpuUsage']
        }
        default: {
            return state;
        }
    }
}

export const metrics = combineReducers({
    cpuUsage,
});

export default metrics;