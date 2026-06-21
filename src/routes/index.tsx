import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar, Header } from "@/components/site/Header";
import { NavMenu } from "@/components/site/NavMenu";
import { ChartsSection } from "@/components/site/ChartsSection";
import { AboutSection } from "@/components/site/AboutSection";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Observatório de Turismo de Olímpia" },
      {
        name: "description",
        content:
          "Observatório de Turismo de Olímpia: dados de lugares mais visitados, média de gasto por setor e por mês da cidade de Olímpia/SP.",
      },
      { property: "og:title", content: "Observatório de Turismo de Olímpia" },
      {
        property: "og:description",
        content:
          "Dados de turismo de Olímpia: lugares mais visitados e média de gasto por setor e por mês.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-background">
      <TopBar />

      <div onMouseLeave={() => setMenuAberto(false)}>
        <Header
          menuAberto={menuAberto}
          onMenuEnter={() => setMenuAberto(true)}
        />

        {menuAberto && <NavMenu />}
      </div>

      <div className="my-10 flex justify-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-foreground sm:text-5xl">
          O que você quer ver hoje?
        </h1>
      </div>

      <ChartsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}