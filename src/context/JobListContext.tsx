import {useContext, createContext, useState} from 'react'

export type SlurmJobBrief = {
    job_id: number;
    name: string;
    cpus: number;
    job_state: string;
    start_time: Date;
    end_time: Date
}

export type SlurmJobList = Array<SlurmJobBrief>

const JobListContext = createContext({
    sjlstate: {} as SlurmJobList,
    updateJobList: (state: SlurmJobList) => {},
})

export default JobListContext