import { SidebarProvider } from "@/components/ui/sidebar";

import { CommonNavbar } from "../components/common-navbar";

interface CommonLayoutProps {
  children: React.ReactNode;
};

export const CommonLayout = ({ children }: CommonLayoutProps) => {
    return (
      <SidebarProvider>
        <div className="w-full">
          <CommonNavbar />
          <div>
            {children}
          </div>
        </div>
      </SidebarProvider>
    );
};