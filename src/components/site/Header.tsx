import { useState } from "react";
import {
  Accessibility,
  Plus,
  Minus,
  Contrast,
  MapPin,
  Globe,
  ChevronDown,
  User,
  Search,
  ArrowDown,
} from "lucide-react";
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
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.33-.28.81-.32 1.71C3.21 8.5 3.2 8.85 3.2 12s.01 3.5.07 4.74c.04.9.19 1.38.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.33.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.33.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.71a2.86 2.86 0 0 0-.69-1.06 2.86 2.86 0 0 0-1.06-.69c-.33-.13-.81-.28-1.71-.32C15.5 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 16.94 4.94 4.94 0 0 1 12 7.06Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-2.94a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <div className="bg-maroon text-maroon-foreground text-[11px] sm:text-xs">
      <div className="mx-auto flex max-w-7xl items-stretch justify-between">
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="hidden font-semibold uppercase tracking-wide sm:inline">
            Acessibilidade
          </span>
          <Accessibility className="h-4 w-4" />
          <button className="flex items-center gap-0.5 font-semibold hover:opacity-80">
            A<Plus className="h-3 w-3" />
          </button>
          <button className="flex items-center gap-0.5 font-semibold hover:opacity-80">
            A<Minus className="h-3 w-3" />
          </button>
          <button className="hover:opacity-80" aria-label="Contraste">
            <Contrast className="h-4 w-4" />
          </button>
          <button className="hover:opacity-80" aria-label="Localização">
            <MapPin className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-black/15 px-4 py-2">
          <Globe className="h-4 w-4" />
          <span>Selecione o idioma</span>
          <span className="opacity-50">|</span>
          <ChevronDown className="h-3 w-3" />
        </div>

        <div className="flex items-center gap-1 px-3 py-2 font-semibold uppercase tracking-wide">
          <User className="h-4 w-4" />
          <span>Login / Cadastro</span>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [query, setQuery] = useState("");
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 md:flex-row md:justify-between md:gap-6">
        <a href="/" className="shrink-0">
          <img
            src={logo}
            alt="Logotipo de Olímpia"
            width={1280}
            height={512}
            className="h-14 w-auto md:h-16"
          />
        </a>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex w-full max-w-md items-stretch overflow-hidden rounded-md border border-border bg-secondary"
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca"
            className="w-full bg-transparent px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-nav px-4 text-nav-foreground transition-colors hover:bg-nav/90"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="grid h-10 w-10 place-items-center rounded-md bg-black text-white transition-transform hover:scale-105"
            aria-label="TikTok"
          >
            <TikTokIcon className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-tr from-yellow-400 via-brand-red to-purple-600 text-white transition-transform hover:scale-105"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-md bg-brand-red text-brand-red-foreground transition-colors hover:bg-brand-red/90"
            aria-label="Downloads"
          >
            <ArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
