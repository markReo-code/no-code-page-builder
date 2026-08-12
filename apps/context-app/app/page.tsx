import ComponentsSidebar from "@repo/ui/components/builder/ComponentsSidebar";
import PageCanvas from "@repo/ui/components/builder/PageCanvas";
import PropertiesPanel from "@repo/ui/components/builder/PropertiesPanel";

export default function Home() {
  return (
    <div className="h-full grid grid-cols-[220px_minmax(0,1fr)_280px] divide-x divide-gray-300">
      <ComponentsSidebar />
      <PageCanvas />
      <PropertiesPanel />
    </div>
  );
}
