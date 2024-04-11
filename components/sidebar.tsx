'use client';


import { sidebarLinks } from "@/consts"
import { cn } from "@/lib/utils";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link"
import { usePathname } from "next/navigation"

// max-sm:hidden lg:w-[264px] -> screen 사이즈가 640px 보다 작으면 sidebar 사라짐, screen 사이즈가 1024px 이상이면 sidebar width는 264px임.
const Sidebar = () => {
    const pathname = usePathname();
    return (
        <section className="sticky left-0 top-0 flex h-screen w-fit flex-col justify-between bg-dark-1 p-6 pt-28 text-white max-sm:hidden lg:w-[264px]">
            <div className="flex flex-col gap-6 flex-1">
                {sidebarLinks.map(link => {
                    const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`)
                    return (
                        <Link key={link.label} href={link.route} className={cn(
                            "flex gap-4 items-center p-4 rounded-lg justify-start", {
                                'bg-blue-1' : isActive
                            }
                        )}>
                            <Image 
                                src={link.imageUrl}
                                alt={link.label}
                                width={24}
                                height={24}
                            />
                            <p className="text-lg font-semibold max-lg:hidden">{link.label}</p>
                        </Link>
                    )
                })}
            </div>
            <SignedIn>
                <UserButton />
            </SignedIn>

        </section>
    )
}

export default Sidebar