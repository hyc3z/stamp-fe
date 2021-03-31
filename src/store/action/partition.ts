import { TReduxAction } from '../../common/const';
import { ACTION_CHANGE_PARTITION } from '../../common/const/partition';
import { TPartition } from '../../typings/partition';
export const changePartition = (partitions: TPartition[]): TReduxAction => {
    return {
        type: ACTION_CHANGE_PARTITION,
        payload: { partitions },
    };
};

export type PartitionActionType = typeof changePartition;
