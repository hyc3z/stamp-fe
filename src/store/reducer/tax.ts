import { TReduxAction } from '../../common/const';
import { combineReducers } from 'redux';
import { ACTION_CHANGE_TAX } from '../../common/const/tax';
import { TTax } from '../../typings/tax';
const taxes = (
    state: TTax[] = [],
    action: TReduxAction
): TTax[] | Partial<TTax>[] => {
    switch (action.type) {
        case ACTION_CHANGE_TAX: {
            return action.payload['taxes'];
        }
        default: {
            return state;
        }
    }
};

export const Tax = combineReducers({
    taxes,
});

export default Tax;
