
export type TConfig = {
    [key: string]: string
}

export enum EConfigActionType {
    SET_CONFIG,
}
export const SET_CONFIG = 'SET_CONFIG';