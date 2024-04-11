'use client';

import { Sheet,SheetClose,SheetContent,SheetTrigger } from "@/components/ui/sheet"
import { sidebarLinks } from "@/consts"
import { cn } from "@/lib/utils";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
  
const MobileNav = () => {
    const pathname = usePathname();
    return (
        <section className="w-full max-w-[264px] lg:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Image src="/icons/hamburger.svg" width={36} height={36} alt="humburger icon" className="cursor-pointer"/>
                </SheetTrigger>
                <SheetContent className="border-none bg-dark-2">
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/icons/logo.svg" width={32} height={32} alt="logo" className="max-sm:size-10"/>
                        <p className="text-[26px] font-extrabold text-white max-sm:hidden">ZoomClone</p>
                    </Link>

                    <div className="flex flex-col overflow-y-auto justify-between h-[calc(100vh-72px)">
                        <SheetClose asChild>
                            <section className="flex h-full flex-col gap-6 pt-16 text-white">
                                <div className="flex flex-col gap-6 flex-1">
                                    {sidebarLinks.map(link => {
                                        const isActive = pathname === link.route 
                                        return (
                                            <SheetClose key={link.label} asChild>
                                                <Link href={link.route} className={cn(
                                                    "flex gap-4 items-center p-4 rounded-lg w-full max-w-60", {
                                                        'bg-blue-1' : isActive
                                                    }
                                                )}>
                                                    <Image 
                                                        src={link.imageUrl}
                                                        alt={link.label}
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <p className="font-semibold ">{link.label}</p>
                                                </Link>
                                            </SheetClose>
                                        )
                                    })}
                                </div>
                            </section>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav