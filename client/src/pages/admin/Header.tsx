import { LuBell, LuChevronDown, LuUser } from "react-icons/lu";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

function Header({ title, subtitle }: HeaderProps) {
  const userFname = "John";
  return (
    <div className="px-4 md:px-12 pt-4 md:pt-12">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between">
          <h3 className="text-foreground text-2xl font-semibold">{title}</h3>
          <div className="flex gap-6 items-center">

            <LuBell/>
            
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-foreground/20 text-background rounded-full">
                <LuUser className="w-5 h-5" />
                </div>
                <h1 className="text-sm">{userFname}</h1>
                <LuChevronDown />
            </div>
          </div>
        </div>
        <p className="text-foreground/60">{subtitle}</p>
      </div>
    </div>
  );
}

export default Header;
