import { cn } from "@/lib/utils"
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { LayoutList, Users2Icon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import EndCallButton from "./end-call-button"
import Loader from "./loader"

type CallLayoutType = 'grid'|'speaker-left'|'speaker-right'

const dropdownItems = [
  {
    label:'그리드',
    value:'grid'
  },
  {
    label:'스피커 왼쪽',
    value:'speaker-left'
  },
  {
    label:'스피커 오른쪽',
    value:'speaker-right'
  },
]


const MeetingRoom = () => {
    const router = useRouter();
    const searchParrams = useSearchParams();
    const isPersonalRoom = !!searchParrams.get('personal')
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
    const [showParticipate, setShowParticipate] = useState(false);
    
    const { useCallCallingState } = useCallStateHooks()
    const callingState = useCallCallingState();
    if(callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
      switch (layout) {
        case 'grid' :
          return <PaginatedGridLayout />
        case 'speaker-right':
          return <SpeakerLayout participantsBarPosition='left'/>
        case 'speaker-left':
          return <SpeakerLayout participantsBarPosition='right'/>
        default :
          return <SpeakerLayout participantsBarPosition='right'/>

      }
    }

    return (
      <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
        <div className="relative flex size-full items-center justify-center">
          <div className="flex size-full max-w-[1000px] items-center">
            <CallLayout />
          </div>

          <div className={cn(
            "h-[calc(100vh-86px)] hidden ml-2",
            showParticipate && "show-animation"
          )}>
            <CallParticipantsList onClose={()=> setShowParticipate(false)}/>
          </div>
        </div>
        
        <div className="fixed w-full items-center  bottom-0 justify-center gap-5 flex flex-wrap">
          <CallControls onLeave={()=> router.push("/")}/>
          <DropdownMenu>
            <div className="flex items-center">
              <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <LayoutList size={20} className="text-white"/>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent className="bg-dark-1 border-none text-white drop-shadow-2xl">
              {dropdownItems.map((item, index)=> (
                <div key={index}>
                  <DropdownMenuItem
                    onClick={()=> setLayout(item.value as CallLayoutType)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className=" bg-dark-2"/>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <CallStatsButton />
          <button onClick={()=> setShowParticipate(prev=>!prev)}>
              <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                <Users2Icon size={20} className="text-white"/>
              </div>
          </button>
          {!isPersonalRoom && <EndCallButton />}
        </div>
      </section>
    )
}

export default MeetingRoom