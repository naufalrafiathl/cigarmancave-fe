// src/app/(dashboard)/components/PolicyLayout.tsx
interface PolicyLayoutProps {
    title: string;
    children: React.ReactNode;
  }
  
  export function PolicyLayout({ title, children }: PolicyLayoutProps) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-[#1E1E1E] rounded-lg shadow-lg mt-8 mb-16">
        <h1 className="text-3xl font-bold mb-6 text-[#EFA427]">{title}</h1>
        <div className="prose prose-invert max-w-none">
          {children}
        </div>
      </div>
    );
  }