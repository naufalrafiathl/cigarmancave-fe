export default function PostLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen rounded-xl bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-0">
          {children}
        </div>
      </div>
    );
  }