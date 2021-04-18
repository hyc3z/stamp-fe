import { TReduxAction } from '../../common/const';
import { combineReducers } from 'redux';
import { SET_CONFIG } from '../../common/const/config';
import { TConfig } from '../../common/const/config';
const clusterConfig = (
    state: TConfig[] = [],
    action: TReduxAction
): TConfig[] | Partial<TConfig>[] => {
    switch (action.type) {
        case SET_CONFIG: {
            return action.payload['configs'];
        }
        default: {
            return state;
        }
    }
};

export const Configs = combineReducers({
    clusterConfig,
});

export default Configs;
