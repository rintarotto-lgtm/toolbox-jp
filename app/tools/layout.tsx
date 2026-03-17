import Breadcrumb from "@/components/Breadcrumb";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Breadcrumb />
      </div>
      {children}
    </>
  );
}
