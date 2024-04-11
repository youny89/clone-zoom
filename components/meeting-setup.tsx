'use client';

import { DeviceSettings, VideoPreview, useCall } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"
import { Button } from "./ui/button";

interface MeetingSetupProps {
    setIsSetupComplete: (value:boolean)=>void
}

const MeetingSetup:React.FC<MeetingSetupProps> = ({setIsSetupComplete}) => {
    const [isMicCamToggledOn,setIsMicCamToggledOn] = useState(false)
    
    const call = useCall();


    const onJoin = () => {
        call?.join();

        // it will render meeting room component!
        setIsSetupComplete(true);
    }

    useEffect(()=>{
        if(isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable()
        } else {
            call?.camera.enable()
            call?.microphone.enable()
        }
    },[isMicCamToggledOn, call?.camera, call?.microphone])

    if(!call) {
        throw new Error('useCall must be used within StreamCall component')
    }
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
            <h1 className="text-2xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input 
                        type="checkbox"
                        checked={isMicCamToggledOn}
                        onChange={(e)=>setIsMicCamToggledOn(e.target.checked)}
                    />
                    Join with mic and camera of off
                </label>
                <DeviceSettings />
            </div>
            <Button onClick={onJoin} className="rounded-md px-4 bg-green-500">미팅 참가하기</Button>
        </div>
    )
}

export default MeetingSetup