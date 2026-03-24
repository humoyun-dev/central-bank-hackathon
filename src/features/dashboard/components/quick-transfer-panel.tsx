const transferContacts = [
  { name: "Jake", tone: "bg-[#ffceb7]" },
  { name: "Dilan", tone: "bg-[#f6d38a]" },
  { name: "Anna", tone: "bg-[#e4d5ff]" },
  { name: "Jhali", tone: "bg-[#b5dcff]" },
  { name: "Max", tone: "bg-[#bcead8]" },
  { name: "Phill", tone: "bg-[#f2d1b4]" },
] as const

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((item) => item[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function QuickTransferPanel() {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
          Quick transfer
        </h2>
      </div>
      <div className="surface-card rounded-[1.75rem] bg-white/78 px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-sm">
              <span className="text-2xl leading-none">+</span>
            </div>
            <span className="text-xs font-medium text-slate-700">Add</span>
          </div>
          {transferContacts.map((contact) => (
            <div key={contact.name} className="flex shrink-0 flex-col items-center gap-2">
              <div
                className={`flex size-14 items-center justify-center rounded-full ${contact.tone} text-sm font-semibold text-slate-950 shadow-sm`}
              >
                {initialsFromName(contact.name)}
              </div>
              <span className="text-xs font-medium text-slate-700">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
