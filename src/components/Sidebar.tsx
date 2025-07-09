
import { Book, Users, UserCheck, BarChart3, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "books", label: "Books", icon: Book },
    { id: "authors", label: "Authors", icon: UserCheck },
    { id: "users", label: "Students", icon: Users },
    { id: "borrowing", label: "Issue/Return", icon: BookOpen },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-amber-900 to-amber-800 shadow-lg">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-amber-100 mb-1">
            SIU Library
          </h1>
          <h2 className="text-lg font-semibold text-amber-200 mb-1">
            Management System
          </h2>
          <p className="text-xs text-amber-300">
            Sylhet International University
          </p>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                  activeTab === item.id
                    ? "bg-amber-700 text-white shadow-md"
                    : "text-amber-200 hover:bg-amber-800 hover:text-white"
                )}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
