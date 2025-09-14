
import { ReactNode } from "react";

import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { UserHeader } from "@/components/user/user-header";


export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div>
        <Header isHome={false}/>
        <main className="">{children}</main>
        <Footer/>
      </div>
    </div>
  );
}
