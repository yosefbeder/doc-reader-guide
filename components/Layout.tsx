import Footer from "./Footer";
import Nav from "./Nav";

export default function Layout({
  title,
  updateable,
  children,
}: Readonly<{
  title: string;
  updateable?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav title={title} updateable={updateable} />
      {children}
      <Footer />
    </>
  );
}
