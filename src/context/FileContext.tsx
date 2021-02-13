import {useContext, createContext, useState} from 'react'

export type FileState = {
    fileList: any[];
    programs: any;
    scripts: any;
    initialized: boolean;
};

 const FileContext = createContext({
    fstate: {} as FileState,
    changeProgramList: (state: any) => {},
    changeFileList: (state: any) => {},
    changeScriptList: (state: any) => {},
    changeProgramScriptList: (programs: any, script: any, init: boolean) => {}
})

export default FileContext