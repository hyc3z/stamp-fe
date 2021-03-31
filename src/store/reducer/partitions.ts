import { TReduxAction } from '../../common/const';
import { combineReducers } from 'redux';
import { ACTION_CHANGE_PARTITION } from '../../common/const/partition';
import { TPartition } from '../../typings/partition';
const partitions = (
    state: TPartition[] = [],
    action: TReduxAction
): TPartition[] | Partial<TPartition>[] => {
    switch (action.type) {
        case ACTION_CHANGE_PARTITION: {
            return action.payload['partitions'];
        }
        default: {
            return state;
        }
    }
};

export const Partition = combineReducers({
    partitions,
});

export default Partition;
