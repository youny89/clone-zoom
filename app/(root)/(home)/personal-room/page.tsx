'use client';

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

interface TableProps {
  title:string;
  description:string;
}

const Table:React.FC<TableProps> = ({title, description}) => {
  return (
    <div className="flex felx-col items-start gap-2 xl:flex-row">
      <h1 className="w-[100px] text-right text-base font-medium text-blue-1 lg:text-xl xl:min-w-32">{title}: </h1>
      <h1 className="truncate text-sm font-bold amx-sm:max-w-[320px] lg:text-xl">{description}</h1>
    </div>
  )
}

const PersonalRoomPage = () => {
    const router = useRouter();
    const { user} = useUser();
    const client = useStreamVideoClient();
    const { toast } = useToast()

    const meetingId = user?.id

    const { call } = useGetCallById(meetingId as string);

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

    const onStart = async () => {
      if(!client || !user) return;

      const newCall = client.call("default", meetingId as string);

      if(!call) {
        await newCall.getOrCreate({
          data: {
            starts_at: new Date().toISOString()
          }
        })
      }

      router.push(`/meeting/${meetingId}?personal=true`);
    }

    const onCopy = () => {
      navigator.clipboard.writeText(meetingLink);
      toast({title:"링크 복사 완료"});
    }

    return (
      <section className="flex size-full flex-col gap-10 text-white">
        <h1 className="text-3xl font-bold">Persnal Meeting Room</h1>

        <div className="w-full flex-col gap-8 xl:max-w-[900px]">
          <Table title="Topic" description={`${user?.username || user?.firstName}님의 미팅룸`}/>
          <Table title="미팅 ID" description={meetingId as string}/>
          <Table title="미팅 링크" description={meetingLink}/>
        </div>

        <div className="flex gap-5">
          <Button onClick={onStart} className="bg-blue-1">
            미팅 시작하기
          </Button>
          <Button onClick={onCopy}>
            링크 복사하기
          </Button>
        </div>
      </section>
    )
}

export default PersonalRoomPage