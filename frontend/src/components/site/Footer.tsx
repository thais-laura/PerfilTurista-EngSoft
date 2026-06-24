import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Info,
  Settings,
} from "lucide-react";
import logo from "@/assets/olimpia-logo-branca.png";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v12.6a2.34 2.34 0 1 1-2.34-2.34c.24 0 .47.04.69.1V9.99a5.67 5.67 0 0 0-.69-.04 5.66 5.66 0 1 0 5.66 5.66V9.01a7.55 7.55 0 0 0 4.4 1.41V7.12a4.28 4.28 0 0 1-3.36-1.3Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.21 8.5 3.2 8.85 3.2 12s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 16.94 4.94 4.94 0 0 1 12 7.06Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-2.94a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

const contacts = [
  {
    icon: MapPin,
    text: "Avenida Brasil, 155 - Patrimônio de São João Batista - CEP: 15400-043",
  },
  {
    icon: Clock,
    text: "Atendimento: Segunda-feira a Sexta-feira das 08h às 17h",
  },
  {
    icon: Phone,
    text: "(17) 3280-6294 - (17) 93300-9824 Whatsapp",
  },
  {
    icon: Mail,
    text: "contatoturismo@olimpia.sp.gov.br",
  },
];

export function Footer() {
  return (
    <footer className="bg-maroon text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_2fr] md:items-center">
        <div className="flex items-center justify-center gap-6 md:justify-start">
          <img
            src={logo}
            alt="Logotipo de Olímpia"
            width={1280}
            height={512}
            loading="lazy"
            className="h-24 w-auto object-contain md:h-28"
          />

          <div className="flex items-center gap-2">
            <a
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full bg-black text-white transition-transform hover:scale-105"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>

            <a
              href="#"
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-tr from-yellow-400 via-brand-red to-purple-600 text-white transition-transform hover:scale-105"
              aria-label="Instagram"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="space-y-4 text-center text-sm font-semibold leading-relaxed md:text-right">
          {contacts.map((contact) => (
            <div
              key={contact.text}
              className="flex items-center justify-center gap-4 md:justify-end"
            >
              <span>{contact.text}</span>
              <contact.icon className="h-6 w-6 shrink-0 text-yellow-400" />
            </div>
          ))}

          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
            <span>Previsão do tempo: Parcialmente Nublado</span>
            <span>| Min 13° | Max 25°</span>

            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-orange-400" />
              <Settings className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs">
          <p>© Copyright Olímpia - 2024 / 2025. Todos os direitos reservados.</p>

          <a
            href="#top"
            className="grid h-9 w-9 place-items-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Voltar ao topo"
          >
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}