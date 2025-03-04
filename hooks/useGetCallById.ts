import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id:string) => {
    const [call, setCall] = useState<Call>()
    const [isCallLoading, setIsCallLoading] = useState(true)

    const client = useStreamVideoClient();
    
    // we can start fetching our currently active call
    // and we going to recall whenever client and id changed.
    useEffect(()=>{
        if(!client) return;

        const loadCall = async () => {
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id
                }
            })

            if(calls.length > 0 ){
                setCall(calls[0])
            }

            setIsCallLoading(false);
        }

        loadCall();
    },[client, id])


    return {
        call, isCallLoading
    }
}