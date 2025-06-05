import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "../../../components/icons/DashIcons";

interface Route {
  name: string;
  path: string;
  layout: string;
  icon?: React.ReactNode;
}

interface SidebarLinksProps {
  routes: Route[];
}

export const SidebarLinks: React.FC<SidebarLinksProps> = ({ routes }) => {
  const location = useLocation();

  // Checks if the current route is active
  const activeRoute = (routePath: string) => {
    return location.pathname.includes(routePath);
  };

  const createLinks = (routes: Route[]) => {
    return routes.map((route, index) => {
      const isAdminOrAuthLayout =
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl";

      if (!isAdminOrAuthLayout) return null;

      const isActive = activeRoute(route.path);

      return (
        <Link key={index} to={`${route.layout}/${route.path}`}>
          <div className="relative mb-3 flex hover:cursor-pointer">
            <li className="my-[3px] flex cursor-pointer items-center px-8">
              <span
                className={`${
                  isActive
                    ? "font-bold text-brand-500 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.icon ? route.icon : <DashIcon />}
              </span>
              <p
                className={`leading-1 ml-4 flex ${
                  isActive
                    ? "font-bold text-navy-700 dark:text-white"
                    : "font-medium text-gray-600"
                }`}
              >
                {route.name}
              </p>
            </li>
            {isActive && (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
            )}
          </div>
        </Link>
      );
    });
  };

  return <>{createLinks(routes)}</>;
};

export default SidebarLinks;