'use client';

import { useGetCalls } from "@/hooks/useGetCalls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import Loader from "./loader";
import MeetingCard from "./meeting-card";
import { useToast } from "./ui/use-toast";

interface CallListProps {
    type:'upcoming'|'ended'|'recordings'
}


const CallList:React.FC<CallListProps> = ({type}) => {
    const router = useRouter();
    const { endedCalls, recordingCalls, upcomingCalls, loading } = useGetCalls();
    const [recordings, setRecordings] = useState<CallRecording[]>([])
    const {toast} = useToast()

    const getCalls = () => {
        switch(type){
            case 'ended':
                return endedCalls
            case 'recordings':
                return recordings
            case 'upcoming':
                return upcomingCalls
            default:
                return[]
        }
    }
    const getNoCallsMessage = () => {
        switch(type){
            case 'ended':
                return '이전 비디오가 존재하지 않습니다.'
            case 'recordings':
                return '기록된 비디오가 존재 하지 않습니다.'
            case 'upcoming':
                return '예약된 비디오가 존재 하지 않습니다.'
            default:
                return[]
        }
    }

    // it will fetch the recordings for each calls.
    useEffect(()=>{

        const fetchRecordings = async () => {
            // first, get the access to actual meetings that theses memebers where in
            try {
                const callData = await Promise.all(recordingCalls?.map((meeting)=>meeting.queryRecordings()) ?? [] ) 
    
                const recordings = callData
                    .filter(call=> call.recordings.length > 0)
                    .flatMap(call=> call.recordings)
    
                setRecordings(recordings);
                
            } catch (error) {
                console.log(error)            
                toast({title:'다시 시도해주세요.'})
            }
         }

        if(type === 'recordings'){
            fetchRecordings();
        }        

    },[type, recordingCalls])

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();
    if(loading) return <Loader />

    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording)=> (
                    <MeetingCard
                        key={(meeting as Call).id}
                        icon={
                            type === 'ended'
                                ? '/icons/previous.svg'
                                : type === 'upcoming'
                                    ? '/icons/upcoming.svg'
                                    : '/icons/recordings.svg'
                        }
                        title={
                            (meeting as Call).state?.custom?.description ||   
                            (meeting as CallRecording).filename?.substring(0,20) ||
                            '제목이 없습니다.'
                        }    
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() ||
                            (meeting as CallRecording).start_time?.toLocaleString()
                        }
                        isPreviousMeeting={type === 'ended'}
                        link={
                            type === 'recordings'
                                ? (meeting as CallRecording).url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                        }
                        buttonIcon={type === 'recordings' ? '/icons/play.svg':undefined}
                        buttonText={type === 'recordings' ? 'Play':'Start'}
                        handleClick={type === 'recordings' 
                             ? ()=> router.push(`${(meeting as CallRecording).url}`)
                             : () => router.push(`/meeting/${(meeting as Call).id}`)
                        }
                    />
                ))
            ) : (
                <p className="text-2xl font-bold text-muted-foreground">{noCallsMessage}</p>
            )}
        </div>
    )
}

export default CallList