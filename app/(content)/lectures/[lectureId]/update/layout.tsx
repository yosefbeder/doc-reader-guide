import Layout from "@/components/Layout";

export const metadata = {
  title: "Lecture Dashboard | DocReader Guide",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout title="Sources" updateable>
      {children}
    </Layout>
  );
}
