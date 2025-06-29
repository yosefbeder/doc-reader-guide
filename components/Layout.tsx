import Footer from "./Footer";
import Nav from "./Nav";

export default function Layout({
  title,
  updateable,
  border,
  children,
}: Readonly<{
  title: string;
  updateable?: boolean;
  border?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav title={title} updateable={updateable} border={border} />
      {children}
      <Footer />
    </>
  );
}
