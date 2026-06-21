import { Mail } from "lucide-react";

type Person = {
  name: string;
  email: string;
  photo?: string;
};

const team: Person[] = [
  {
    name: "Gabriella Castelari Gonçalves",
    email: "gabriellacastelari@usp.br",
    photo: "/team/gabriella.png",
  },
  {
    name: "Matheus Lopes Ponciano Lima",
    email: "matheusponciano@usp.br",
    photo: "/team/matheus.png",
  },
  {
    name: "Murilo Cury Pontes",
    email: "murilopontes@usp.br",
    photo: "/team/murilo.png",
  },
  {
    name: "Nicolas Zimmer Fernandes",
    email: "nicolaszf@usp.br",
    photo: "/team/nicolas.png",
  },
  {
    name: "Thais Laura Anicio Andrade",
    email: "thais.laura@usp.br",
    photo: "/team/thais.png",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AboutSection() {
  return (
    <section className="border-t border-border bg-background py-14">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">
          Sobre nós
        </h2>

        <p className="mx-auto mt-3 max-w-3xl text-sm text-muted-foreground">
          Somos graduandos da Engenharia de Computação da Universidade de São
          Paulo, campus de São Carlos, responsáveis pelo desenvolvimento deste
          protótipo do Observatório de Turismo de Olímpia.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {team.map((person) => (
            <article
              key={person.email}
              className="group flex min-h-[285px] flex-col rounded-xl border border-border bg-card px-5 py-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-maroon hover:bg-maroon hover:text-white hover:shadow-md"
            >
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={`Foto de ${person.name}`}
                  className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-secondary transition-all duration-300 group-hover:ring-white"
                />
              ) : (
                <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-maroon text-2xl font-bold text-white ring-4 ring-secondary transition-all duration-300 group-hover:bg-white group-hover:text-maroon group-hover:ring-white">
                  {getInitials(person.name)}
                </div>
              )}

              <h3 className="mt-4 min-h-[44px] text-base font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-white">
                {person.name}
              </h3>

              <a
                href={`mailto:${person.email}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 text-[13px] text-info transition-colors duration-300 group-hover:text-white hover:underline"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="break-normal">{person.email}</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}