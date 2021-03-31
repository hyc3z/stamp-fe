import { useContext, createContext, useState } from 'react';
export type LoginInfo = {
    user_name: string;
    user_jwt: string;
    validated: boolean;
    user_type: 'admin' | 'user';
};

const JobListContext = createContext({
    authstate: {} as LoginInfo,
    validateLogin: () => {},
    changeLoginState: (loginInfo: any) => {},
});

export default JobListContext;
