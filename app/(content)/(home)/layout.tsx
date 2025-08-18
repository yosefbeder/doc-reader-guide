import Layout from "@/components/Layout";

export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function ModulesPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="Modules" updateable border>
      {children}
    </Layout>
  );
}
