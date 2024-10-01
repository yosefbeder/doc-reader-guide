import Layout from "@/components/Layout";

export default function ModulesPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="الموديولات" updateable>
      {children}
    </Layout>
  );
}
