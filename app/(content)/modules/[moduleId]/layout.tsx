import Layout from "@/components/Layout";

export default function SubjectsPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="المواد" updateable>
      {children}
    </Layout>
  );
}
