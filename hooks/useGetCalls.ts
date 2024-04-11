'use client';

import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {
    const  [calls, setCalls] = useState<Call[]>()
    const [loading, setLoading] = useState(false);
    const client = useStreamVideoClient();
    const { user } = useUser();

    useEffect(()=>{
        const loadCalls = async () => {
            if(!client || !user?.id) return;
            setLoading(true)

            try {
                 // https://getstream.io/video/docs/react/guides/querying-calls/#filters
             const { calls }  = await client.queryCalls({
                sort: [{field:'starts_at', direction:-1}],
                filter_conditions: {
                    starts_at: { $exists: true },
                    $or: [
                        { created_by_user_id: user.id },
                        { members: { $in: [user.id]}}
                    ]
                }
             });

             setCalls(calls);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        loadCalls();
    },[client, user?.id])

    // if it's after now, it is an ended call
    // if it's before now, it is an upcoming call.
    const now = new Date();

    // 시작 시간 프로퍼티가 존재하고, 시작 시간 값이 현재 시간보다 작다면 이미 끝난 콜이다.
    // 끝나는 시간 프로퍼티가 존재하면, 이미 끝난 콜이다.
    const endedCalls = calls?.filter((
        { state : { startsAt, endedAt }}: Call
    ) => {
        return ( startsAt && new Date(startsAt) < now || !!endedAt)
    });

    const upcomingCalls = calls?.filter((
        { state : { startsAt }} : Call
    )=> {
         return startsAt && new Date(startsAt) > now
    });

    return {
        endedCalls,
        upcomingCalls,
        recordingCalls: calls,
        loading
    }
}