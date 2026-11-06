import { BookOpenCheck, CircleEllipsis, SearchCheck } from "lucide-react";
import type { EditorialStatus } from "@/data/editorial";

const statusConfig = {
  "Editorial orientation": { icon: BookOpenCheck, className: "is-editorial" },
  "Needs source review": { icon: CircleEllipsis, className: "is-review" },
  "Ready for guided learning": { icon: SearchCheck, className: "is-ready" },
} as const;

export function EditorialStatusBadge({ status }: { status: EditorialStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`editorial-status-badge ${config.className}`}>
      <Icon size={13} aria-hidden="true" />
      {status}
    </span>
  );
}
