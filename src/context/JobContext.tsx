import {useContext, createContext, useState} from 'react'


export type JobScript = {
    name: string,
    content: string
}

export type JobSpec = {
    name: string
}

export type JobStatus = {

}
export type JobState = {
    jobScript: JobScript,
    jobSpec: JobSpec,
    jobStatus: JobStatus,
};

 const JobContext = createContext({
    jobState: {} as JobState,
    changeJobScript: (script: JobScript) => {},
    changeJobSpec: (spec: JobSpec) => {},
    changeJobStatus: (spec: JobStatus) => {},
})

export default JobContext