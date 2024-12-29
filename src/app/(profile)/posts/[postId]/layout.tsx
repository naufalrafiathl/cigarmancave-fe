export default function PostLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </div>
    );
  }