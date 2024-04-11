'use client';

import { useState } from "react"
import HomeCard from "./home-card"
import { useRouter } from "next/navigation"
import MeetingModal from "./meeting-modal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker'
import { Input } from "./ui/input";
type MeetingType = 'schedule' | 'join' | 'instant' | undefined

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<MeetingType>()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description:'',
        link:''
    })
    const [callDetails,setCallDetails] = useState<Call>()
    const { user } = useUser();
    const client = useStreamVideoClient()

    const { toast } = useToast()

    const createNewMeeting = async () => {
        if(!client || !user) return;

        try {
            if(!values.dateTime) {
                toast({title:"Please select a date time"});
                return;
            }

            // generate random id for call id.
            const id = crypto.randomUUID();
            const call = client.call('default',id)
            if(!call) throw new Error('Failed to create call')

            const startsAt = values.dateTime.toISOString() ||new Date(Date.now()).toISOString(); 
            const description = values.description || 'Instant Meeting!';

            await call.getOrCreate({
                data: {
                    starts_at:startsAt,
                    custom: {
                        description
                    }
                }
            });

            setCallDetails(call);

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({title:"Meeting created!"});
        } catch (error) {
            console.log(error)
            toast({title:"Failed to create meeting."});
        }
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
        <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <HomeCard 
                    className="bg-orange-500"
                    img='/icons/add-meeting.svg'
                    title="새로운 미팅"
                    description="새로운 미팅을 시작하세요"
                    handleClick={()=> setMeetingState('instant')}/>
                <HomeCard 
                    className="bg-rose-500"
                    img='/icons/join-meeting.svg'
                    title="미팅참가"
                    description="링크 주소를 입력하세요"
                    handleClick={()=> setMeetingState('join')}/>

                <HomeCard 
                    className="bg-purple-500"
                    img='/icons/schedule.svg'
                    title="스케줄 미팅"
                    description="미팅을 계획하세요"
                    handleClick={()=> setMeetingState('schedule')}/>
                <HomeCard 
                    className="bg-sky-500"
                    img='/icons/recordings.svg'
                    title="미팅 기록"
                    description="저장된 미팅을 확인하세요"
                    handleClick={()=> router.push('/recordings')}/>
            </div>

            {!callDetails ? (
                <MeetingModal 
                    isOpen={meetingState === 'schedule'}
                    title="Create Meeting"
                    onClose={()=>setMeetingState(undefined)}
                    handleClick={createNewMeeting}
                >
                    <div className="flex flex-col gap-3">
                        <label className="text-base leading-5 text-blue-50">미팅 설명</label>
                        <Textarea className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-dark-1" onChange={e=> setValues({...values, description:e.target.value})}/>
                    </div>

                    <div className="w-full flex-col gap-3">
                        <label className="text-base leading-5 text-blue-50">날짜를 선택하세요</label>
                        <ReactDatePicker 
                            selected={values.dateTime}
                            onChange={(date)=>setValues({
                                ...values,
                                dateTime:date!
                            })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="시간"
                            dateFormat="yyyy년 MM월 d일 h시 m분"
                            className="w-full rounded-md bg-dark-1 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ) : (
                <MeetingModal 
                    isOpen={meetingState === 'schedule'}
                    title="새로운 미팅을 맏들었습니다"
                    onClose={()=>setMeetingState(undefined)}
                    buttonText="미팅 링크 복사하기"
                    handleClick={()=> {
                        navigator.clipboard.writeText(meetingLink)
                        toast({title:"미팅 링크을 복사 했습니다"})
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                />
            )}
            <MeetingModal 
                    isOpen={meetingState === 'join'}
                    title="미팅 링크를 입력해주세요"
                    onClose={()=>setMeetingState(undefined)}
                    buttonText="미팅 참가하기"
                    handleClick={()=> router.push(values.link)}
            >
                <Input
                    onChange={e=> setValues({...values, link:e.target.value})}
                    placeholder="미팅 링크"
                    className="border-none bg-dark-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                 />
            </MeetingModal>
            <MeetingModal 
                isOpen={meetingState === 'instant'}
                title="새로운 미팅을 시작하세요"
                onClose={()=>setMeetingState(undefined)}
                handleClick={createNewMeeting}
                buttonText="새로운 미팅 만들기"
            />
        </>

    )
}

export default MeetingTypeList