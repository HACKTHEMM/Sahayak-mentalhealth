import React from "react";
import { Delete, Star, Trash } from "lucide-react";
import { cls, timeAgo } from "./utils";

export default function ConversationRow({ data, active, onSelect, onTogglePin, showMeta }) {
  const count = Array.isArray(data.messages) ? data.messages.length : data.messageCount;
  return (
    <div className="group relative">
      <div className="relative flex items-center">
        <button
          onClick={onSelect}
          className={cls(
            "-mx-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left overflow-hidden transition-all duration-200",
            active
              ? "bg-white/15 backdrop-blur-md border border-white/20"
              : "hover:bg-white/10"
          )}
          title={data.title}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium tracking-tight">
                {data.title.length > 10 ? `${data.title.slice(0, 10)}...` : data.title}
              </span>
              <span className="shrink-0 text-[11px] text-glass/60">
                {timeAgo(data.updatedAt)}
              </span>
            </div>
            {showMeta && (
              <div className="mt-0.5 text-[11px] text-glass/60">
                {count} messages
              </div>
            )}
          </div>
          {/* Spacer to make room for delete button */}
          <div className="w-8"></div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          title={data.pinned ? "Restore" : "Delete"}
          className="absolute right-3 rounded-md p-1 text-glass/60 opacity-0 transition group-hover:opacity-100 glass-hover z-10"
          aria-label={data.pinned ? "Unpin conversation" : "Pin conversation"}
        >
          {data.pinned ? (
            <Trash className="h-4 w-4 fill-glass text-glass" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="pointer-events-none absolute left-[calc(100%+6px)] top-1 hidden w-64 rounded-xl glass-strong p-3 text-xs text-glass shadow-glass md:group-hover:block">
        <div className="line-clamp-6 whitespace-pre-wrap">{data.preview}</div>
      </div>
    </div>
  );
}
