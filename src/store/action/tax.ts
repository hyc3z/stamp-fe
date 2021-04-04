import { TReduxAction } from '../../common/const';
import { ACTION_CHANGE_TAX } from '../../common/const/tax';
import { TTax } from '../../typings/tax';
export const changeTax = (taxes: TTax[]): TReduxAction => {
    return {
        type: ACTION_CHANGE_TAX,
        payload: { taxes },
    };
};

export type TaxActionType = typeof changeTax;
