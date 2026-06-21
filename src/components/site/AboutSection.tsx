const team = [
  "Thais Laura Anicio Andrade",
  "Gabriella Castelari Gonçalves",
  "Matheus Lopes Ponciano Lima",
  "Murilo Cury Pontes",
  "Nicolas Zimmer Fernandes",
];

export function AboutSection() {
  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">Sobre nós</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Graduandos da Engenharia de Computação da Universidade de São Paulo, campus de São Carlos.
        </p>
        <ul className="mt-4 space-y-1">
          {team.map((name) => (
            <li key={name} className="text-sm text-info">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
