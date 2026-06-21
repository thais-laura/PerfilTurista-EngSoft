import {
  Menu,
  BedDouble,
  Utensils,
  Store,
  Briefcase,
  CalendarDays,
  Megaphone,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  Newspaper,
  Mail,
  Phone,
  Star,
  type LucideIcon,
} from "lucide-react";

type Item = { label: string; icon: LucideIcon };

const columns: Item[][] = [
  [
    { label: "Onde Ficar", icon: BedDouble },
    { label: "Onde Comer", icon: Utensils },
    { label: "Comércio e Serviços", icon: Store },
    { label: "Outros Serviços", icon: Briefcase },
    { label: "Agenda de Eventos", icon: CalendarDays },
  ],
  [
    { label: "Você conhece nosso Festival do Folclore?", icon: Megaphone },
    { label: "Acesse nosso Guia Virtual", icon: BookOpen },
    { label: "Olímpia quer sua opnião!!", icon: MessageSquare },
    { label: "Política de acesso dos múnices aos atrativos turísticos", icon: ShieldCheck },
  ],
  [
    { label: "Observatório de Turismo de Olímpia", icon: BarChart3 },
    { label: "Últimas Notícias", icon: Newspaper },
    { label: "Contato", icon: Mail },
    { label: "Ouvidoria", icon: Phone },
    { label: "Perfil do Turista", icon: Star, highlight: true } as Item & { highlight: boolean },
  ],
];

const sideItems: Item[] = [
  { label: "Por que Olímpia?", icon: Store },
  { label: "A Cidade", icon: BookOpen },
  { label: "Como Chegar", icon: BedDouble },
  { label: "Onde Ir", icon: Briefcase },
];

export function NavMenu() {
  return (
    <nav className="bg-nav text-nav-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,1.2fr))]">
          {/* Side / MENU column */}
          <div className="space-y-4">
            <button className="flex w-full items-center gap-3 rounded-md bg-white/10 px-4 py-3 font-semibold tracking-wide transition-colors hover:bg-white/15">
              <Menu className="h-5 w-5" />
              <span>MENU</span>
            </button>
            <ul className="space-y-3 pl-1">
              {sideItems.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-sm uppercase tracking-wide text-nav-foreground/90 transition-colors hover:text-nav-foreground"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {columns.map((col, i) => (
            <ul key={i} className="space-y-4">
              {col.map((item) => {
                const highlighted = (item as Item & { highlight?: boolean }).highlight;
                return (
                  <li key={item.label}>
                    <a
                      href="#"
                      className={`flex items-start gap-3 text-sm uppercase leading-tight tracking-wide transition-colors ${
                        highlighted
                          ? "rounded-md border-2 border-brand-red px-3 py-2 text-nav-foreground"
                          : "text-nav-foreground/90 hover:text-nav-foreground"
                      }`}
                    >
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </nav>
  );
}
