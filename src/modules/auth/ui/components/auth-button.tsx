import { UserCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const AuthButton = () => {
  return (
    <Button>
      <UserCircleIcon />
      Sign in
    </Button>
  )
}