import Layout from "@/components/Layout";

export default function LecturesPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="Lectures" updateable>
      {children}
    </Layout>
  );
}
