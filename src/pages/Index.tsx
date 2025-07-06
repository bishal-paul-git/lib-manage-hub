
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BooksManager } from "@/components/BooksManager";
import { AuthorsManager } from "@/components/AuthorsManager";
import { UsersManager } from "@/components/UsersManager";
import { BorrowingManager } from "@/components/BorrowingManager";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "books":
        return <BooksManager />;
      case "authors":
        return <AuthorsManager />;
      case "users":
        return <UsersManager />;
      case "borrowing":
        return <BorrowingManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
