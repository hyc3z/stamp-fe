import { TReduxAction } from '../../common/const';
import { SET_CONFIG, TConfig } from '../../common/const/config';
export const changeConfig = (configs: TConfig[]): TReduxAction => {
    return {
        type: SET_CONFIG,
        payload: { configs },
    };
};

export type configType = typeof changeConfig;
