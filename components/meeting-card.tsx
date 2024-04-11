

import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { avatarImages } from "@/consts";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingCardProps {
    title: string;
    date: string;
    icon: string;
    isPreviousMeeting?: boolean;
    buttonIcon?:string;
    buttonText?: string;
    handleClick:()=> void;
    link: string;
}


const MeetingCard:React.FC<MeetingCardProps> = ({
    title,
    date,
    icon,
    isPreviousMeeting,
    buttonIcon,
    buttonText,
    handleClick,
    link
}) => {
    const { toast } = useToast();

    const onCopy = () => {
        navigator.clipboard.writeText(link);
        toast({ title:"링크 복사 완료"})
    }

    return (
        <section className="flex min-h-[258px] w-full flex-col justify-between rounded-xl bg-dark-1 px-5 py-8 xl:max-w-[568px]">
            <article className="flex flex-col gap-5">
                <Image src={icon} alt="image" width={28} height={28}/>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-base font-normal">{date}</p>
                    </div>
                </div>
            </article>
            <article className="flex justify-center relative">
                <div className="relative flex w-full">
                    {avatarImages.map((img, index)=> (
                        <Image 
                            key={index}
                            src={img}
                            alt="attendees"
                            width={40}
                            height={40}
                            className={cn("rounded-full", index > 0 && "absolute")}
                            style={{top:0, left: index * 28 }}
                        />
                    ))}
                    <div className="flex justify-center items-center absolute left-[136px] size-10 rounded-full 2 bg-dark-3">+5</div>
                </div>

                {!isPreviousMeeting && (
                    <div className="flex gap-2">
                        <Button onClick={handleClick} className="rounded bg-blue-1 hover:bg-blue-1/80 px-6">
                            {buttonIcon && ( <Image 
                                src={buttonIcon}
                                alt="icon"
                                width={20}
                                height={20}
                            />)}
                            &nbsp; {buttonText}
                        </Button>
                        <Button onClick={onCopy} className="bg-dark-4">
                            <Image src="/icons/copy.svg" alt="copy" width={20} height={20}/>
                            &nbsp; 링크 복사
                        </Button>
                    </div>
                )}
            </article>
        </section>
    )
}

export default MeetingCard