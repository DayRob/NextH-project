import { ReactNode } from "react"
import { Sparkles } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 to-transparent p-6 text-white shadow-lg shadow-black/20 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-widest text-cyan-100">
          <Sparkles className="h-3 w-3" />
          NextH
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  )
}

