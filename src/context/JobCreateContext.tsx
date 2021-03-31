import { useContext, createContext, useState } from 'react';

export type JobScript = {
    name: string;
    content: string;
};

export type JobSpec = {
    name: string;
};

export type JobStatus = {};
export type JobInfo = {
    jobScript: JobScript;
    jobSpec: JobSpec;
    jobStatus: JobStatus;
};

const JobCreateContext = createContext({
    jobState: {} as JobInfo,
    changeJobScript: (script: JobScript) => {},
    changeJobSpec: (spec: JobSpec) => {},
    changeJobStatus: (spec: JobStatus) => {},
});

export default JobCreateContext;
