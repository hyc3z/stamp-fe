import {useContext, createContext, useState} from 'react'
import { ContentState, EditorState } from 'react-draft-wysiwyg';

export type WysiwygState = {
    editorContent: any;
    contentState: any;
    editorState: EditorState | undefined;
    scriptPath: string;
};

 const WysiwygContext = createContext({
    wstate: {} as WysiwygState,
    changeState: (state: any) => {},
    changeStateWithString: (str: string, str2?: string) => {},
    changeScriptPath: (path: string) => {}
})

export default WysiwygContext