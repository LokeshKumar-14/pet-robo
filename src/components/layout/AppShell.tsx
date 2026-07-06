import { NavLink, Outlet } from "react-router-dom";
import { Bot, Gauge, Mic, Radar, Settings, SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useRobotSocket } from "@/hooks/useRobotSocket";
import { useRobotStore } from "@/store/robotStore";
import { cn } from "@/utils/cn";

const nav = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/ai", label: "AI", icon: Mic },
  { to: "/control", label: "Control", icon: Bot },
  { to: "/radar", label: "Radar", icon: Radar },
  { to: "/sensors", label: "Sensors", icon: SlidersHorizontal },
  { to: "/settings", label: "Settings", icon: Settings }
];

export function AppShell() {
  useRobotSocket(true);
  const location = useLocation();
  const theme = useRobotStore((state) => state.theme);

  return (
    <div className={cn("min-h-dvh overflow-hidden bg-ink text-white", theme === "arctic" && "bg-[#081014]", theme === "graphite" && "bg-[#090a0c]")}>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(104,232,255,0.14),transparent_32%),radial-gradient(circle_at_90%_18%,rgba(167,255,104,0.1),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />
      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] md:px-8 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="min-h-0 flex-1"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-ink/82 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-2xl md:hidden">
        <div className="grid grid-cols-6 gap-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn("flex h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-white/52 transition", isActive && "bg-white/10 text-cyan")
              }
            >
              <item.icon size={20} />
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
      <aside className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-lg border border-white/10 bg-white/[0.055] p-2 backdrop-blur-xl md:block">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.label}
            className={({ isActive }) => cn("mb-1 flex h-12 w-12 items-center justify-center rounded-lg text-white/50 transition last:mb-0", isActive && "bg-cyan text-ink")}
          >
            <item.icon size={21} />
          </NavLink>
        ))}
      </aside>
    </div>
  );
}
