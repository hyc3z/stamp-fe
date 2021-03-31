export interface TReduxAction {
    type: string;
    payload: { [key: string]: any };
}
