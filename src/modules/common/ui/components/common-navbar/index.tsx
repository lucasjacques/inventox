"use client";

import Image from "next/image"
import Link from "next/link"
import { useAuth, useClerk } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"
import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const items = [
  {
    name: "Estoque",
    url: "/inventory",
    auth: true
  },
  {
    name: "Entrada",
    url: "/stock-ins",
    auth: true
  },
  {
    name: "Saída",
    url: "/stock-outs",
    auth: true
  },
  {
    name: "Imprimir",
    url: "/print",
    auth: true
  },
];

export const CommonNavbar = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth(); 

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-blue-500 flex items-center px-2 pr-5 z-50">
      <div className="flex items-center gap-4 w-full">
          {/* Menu and Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <div className="p-4 flex items-center gap-1">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                <p className="text-xl font-semibold tracking-tight">Inventox</p>
              </div>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {items.map((item, index)=>{
                  return (
                    <NavigationMenuItem key={index}>
                      <Button onClick={(e)=>{
                        if (!isSignedIn && item.auth ) {
                          e.preventDefault();
                          return clerk.openSignIn();
                        }
                      }}>
                        <Link href={item.url}>
                            <p className="p-4">{item.name}</p>
                        </Link>
                      </Button>
                    </NavigationMenuItem>)
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex-shrink-0 items-center flex gap-4">
            <AuthButton />
          </div>
      </div>
    </nav>
  )
}