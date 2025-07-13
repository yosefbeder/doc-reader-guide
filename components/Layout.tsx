import Footer from "./Footer";
import Nav from "./Nav";
import NotificationsToast from "./NotificationsToast";

export default function Layout({
  title,
  updateable,
  border,
  footer = true,
  children,
}: Readonly<{
  title: string;
  updateable?: boolean;
  border?: boolean;
  footer?: boolean;
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav title={title} updateable={updateable} border={border} />
      <NotificationsToast />
      {children}
      {footer && <Footer />}
    </>
  );
}
