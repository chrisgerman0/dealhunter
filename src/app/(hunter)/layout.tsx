import { Header } from "@/components/layout/header";

export default function HunterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1600px]">{children}</main>
    </>
  );
}
