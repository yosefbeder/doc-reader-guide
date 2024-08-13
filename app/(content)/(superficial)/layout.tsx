export default function SuperficialLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="main">{children}</main>;
}
