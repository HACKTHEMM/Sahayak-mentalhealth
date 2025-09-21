import { cls } from "./utils"

export default function Message({ role, children }) {
  const isUser = role === "user"
  return (
    <div className={cls("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full glass-strong text-[10px] font-bold text-glass shadow-glass">
          SA
        </div>
      )}
      <div
        className={cls(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-glass",
          isUser
            ? "glass-strong text-glass"
            : "glass text-glass border-white/20 dark:border-white/10",
        )}
      >
        {children}
      </div>
      {isUser && (
        <div className="mt-0.5 grid h-7 w-7 place-items-center rounded-full glass-strong text-[10px] font-bold text-glass shadow-glass">
          JD
        </div>
      )}
    </div>
  )
}
