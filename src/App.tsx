import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AIPage } from "@/pages/AIPage";
import { Control } from "@/pages/Control";
import { Dashboard } from "@/pages/Dashboard";
import { RadarPage } from "@/pages/RadarPage";
import { Sensors } from "@/pages/Sensors";
import { Settings } from "@/pages/Settings";

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/ai", element: <AIPage /> },
      { path: "/control", element: <Control /> },
      { path: "/radar", element: <RadarPage /> },
      { path: "/sensors", element: <Sensors /> },
      { path: "/settings", element: <Settings /> }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
