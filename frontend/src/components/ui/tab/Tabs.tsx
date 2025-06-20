import React, { useState } from "react";
import clsx from "clsx";

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

interface TabsProps {
  tabs: TabItem[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      <nav
        className="flex gap-x-1 border-b border-gray-200 dark:border-gray-700"
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "py-2 px-4 text-sm font-medium rounded-t-lg transition-colors",
              "text-gray-500 dark:text-neutral-400",
              "hover:text-blue-600 dark:hover:text-white",
              activeTab === tab.id &&
                "bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-white"
            )}
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`tab-panel-${tab.id}`}
            role="tabpanel"
            hidden={activeTab !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
