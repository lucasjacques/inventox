import Image from "next/image"
import Link from "next/link"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import { AuthButton } from "@/modules/auth/ui/components/auth-button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

export const HomeNavbar = () => {
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
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Estoque</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button>
                  <p className="p-4">Entrada</p>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button>
                    <p className="p-4">Saída</p>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button>
                    <p className="p-4">Imprimir</p>
                  </Button>
                </NavigationMenuItem>
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