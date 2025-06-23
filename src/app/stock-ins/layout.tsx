import { CommonLayout } from "@/modules/common/ui/layouts/common-layout";

interface LayoutProps {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <CommonLayout>
      {children}
    </CommonLayout>
  )
}

export default Layout;