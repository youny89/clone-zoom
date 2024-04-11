'use client';

import Loader from "@/components/loader";
import MeetingRoom from "@/components/meeting-room";
import MeetingSetup from "@/components/meeting-setup";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";

interface MeetingPageProps {
    params: { id: string; }
}

const MeetingPage:React.FC<MeetingPageProps> = ({params}) => {
    const {user, isLoaded} = useUser()
    const [isSetupComplete, setIsSetupComplete] = useState(false);
    const { call, isCallLoading } = useGetCallById(params?.id);
    if(!isLoaded || isCallLoading) return <Loader />

    return (
      <main className="w-full h-screen">
        <StreamCall call={call}>
          <StreamTheme>
            {!isSetupComplete ? 
              ( <MeetingSetup setIsSetupComplete={setIsSetupComplete}/>) : 
              (<MeetingRoom />)}

          </StreamTheme>
        </StreamCall>
      </main>
    )
}

export default MeetingPage