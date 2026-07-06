import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import type { RobotCommand } from "@/types/robot";

export function CommandButton({
  icon,
  label,
  command,
  send,
  danger
}: {
  icon: ReactNode;
  label: string;
  command: RobotCommand;
  send: (command: RobotCommand) => void;
  danger?: boolean;
}) {
  return (
    <Button variant={danger ? "danger" : "secondary"} className="h-14 flex-col gap-1 px-3 text-[11px]" onClick={() => send(command)}>
      <span className="text-base">{icon}</span>
      <span className="max-w-full truncate">{label}</span>
    </Button>
  );
}
