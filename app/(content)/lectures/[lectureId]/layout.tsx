import Layout from "@/components/Layout";

export default function LinksPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="Sources" updateable>
      {children}
    </Layout>
  );
}
