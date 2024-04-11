'use client';

import Image from "next/image";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
    isOpen:boolean;
    onClose:()=>void;
    title:string;
    className?:string;
    children?:React.ReactNode;
    handleClick?:()=>void;
    image?:string;
    buttonText?:string;
    buttonClassName?:string;
    buttonIcon?:string;
    isInstantMeeting?:boolean;
}


const MeetingModal:React.FC<MeetingModalProps> = ({
    isOpen,
    onClose,
    title,
    className,
    children,
    handleClick,
    image,
    buttonText,
    buttonClassName,
    buttonIcon,
    isInstantMeeting
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-2 px-6 py-9 text-white">
                <div className="flex flex-col gap-6">
                    {image && (
                        <div className="flex justify-center">
                            <Image src={image} alt="chcked" width={72} height={72}/>
                        </div>
                    )}
                    <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>{title}</h1>
                    {children}
                    <Button onClick={handleClick} className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-blue-1/80">
                        {buttonIcon && (
                            <Image src={buttonIcon} alt="button icon" width={13} height={13}/>
                        )}{" "}
                        &nbsp;
                        {buttonText || "Schedule Meeting"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MeetingModal