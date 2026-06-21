import { MapPin, Clock, Phone, Mail, CloudSun, ArrowUp } from "lucide-react";
import logo from "@/assets/olimpia-logo.png";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v12.6a2.34 2.34 0 1 1-2.34-2.34c.24 0 .47.04.69.1V9.99a5.67 5.67 0 0 0-.69-.04 5.66 5.66 0 1 0 5.66 5.66V9.01a7.55 7.55 0 0 0 4.4 1.41V7.12a4.28 4.28 0 0 1-3.36-1.3Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 6.66A3.14 3.14 0 1 0 12 15.14 3.14 3.14 0 0 0 12 8.86Zm5.14-2.94a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

const contacts = [
  { icon: MapPin, text: "Avenida Brasil, 555 - Prefeitura de São João Batista - CEP: 15400-043" },
  { icon: Clock, text: "Atendimento: Segunda-feira a Sexta-feira das 08h às 17h" },
  { icon: Phone, text: "(17) 3266-4294 / (17) 99300-9824 Whatsapp" },
  { icon: Mail, text: "contatoturismo@olimpia.sp.gov.br" },
  { icon: CloudSun, text: "Previsão de tempo: Parcialmente Nublado | Min: 17° | Max: 21°" },
];

export function Footer() {
  return (
    <footer className="bg-maroon text-maroon-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-2 md:items-center">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="Logotipo de Olímpia"
            width={1280}
            height={512}
            loading="lazy"
            className="h-12 w-auto brightness-0 invert"
          />
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="grid h-8 w-8 place-items-center rounded bg-black text-white"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="grid h-8 w-8 place-items-center rounded bg-gradient-to-tr from-yellow-400 via-brand-red to-purple-600 text-white"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <ul className="space-y-3">
          {contacts.map((c) => (
            <li key={c.text} className="flex items-start justify-between gap-4 text-xs">
              <span className="text-maroon-foreground/90">{c.text}</span>
              <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-maroon-foreground/80" />
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-[10px] text-maroon-foreground/70">
          <span>© Copyright Olímpia · 2024 / 2025. Todos os direitos reservados.</span>
          <a
            href="#top"
            className="grid h-8 w-8 place-items-center rounded bg-white/10 transition-colors hover:bg-white/20"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
