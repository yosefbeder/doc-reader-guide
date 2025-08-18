import Layout from "@/components/Layout";

export const metadata = {
  title: "Users Dashboard | DocReader Guide",
  robots: { index: false, follow: false, nocache: true },
};

export default function LinksPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout title="Users" border>
      {children}
    </Layout>
  );
}
