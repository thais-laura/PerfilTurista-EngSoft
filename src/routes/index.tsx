import { createFileRoute } from "@tanstack/react-router";
import { TopBar, Header } from "@/components/site/Header";
import { NavMenu } from "@/components/site/NavMenu";
import { ChartsSection } from "@/components/site/ChartsSection";
import { AboutSection } from "@/components/site/AboutSection";
import { Footer } from "@/components/site/Footer";
import banner from "@/assets/banner-lazer.jpg";

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
  return (
    <div id="top" className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <NavMenu />
      <ChartsSection />
      <AboutSection />
      <Footer />
    </div>
  );
}
