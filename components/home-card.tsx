import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'

interface HomeCardProps {
    title:string;
    img:string;
    description:string;
    className:string;
    handleClick:()=>void;
}

const HomeCard:React.FC<HomeCardProps> = ({
    img,
    title,
    description,
    className,
    handleClick
}) => {
    return (
        <div onClick={handleClick} className={cn("px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-md cursor-pointer hover:opacity-85", className)}>
            <div className="flex items-center justify-center glassmorphism size-12 rounded-sm">
                <Image src={img} alt={title} width={27} height={27}/>
            </div>
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="font-normal">{description}</p>
            </div>
        </div> 
    )
}

export default HomeCard