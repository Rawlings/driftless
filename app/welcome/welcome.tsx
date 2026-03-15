import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { BookOpen, Globe } from 'lucide-react'

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="RUI"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="RUI"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="space-y-4 rounded-3xl border border-[var(--surface-border)] p-6">
            <p className="text-center leading-6 text-[var(--text-color-secondary)]">
              What&apos;s next?
            </p>
            <ul>
              {resources.map(({ href, text, icon }) => (
                <li key={href}>
                  <a
                    className="group flex items-center gap-3 self-stretch p-3 leading-normal text-[var(--primary-color)] hover:underline"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {icon}
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

const resources = [
  {
    href: "https://rawlings.github.io/rui/",
    text: "RUI Live Site",
    icon: <Globe className="h-5 w-5 text-[var(--text-color-secondary)] group-hover:text-current" aria-hidden="true" />,
  },
  {
    href: "https://www.w3.org/TR/CSS/",
    text: "CSS Specification",
    icon: <BookOpen className="h-5 w-5 text-[var(--text-color-secondary)] group-hover:text-current" aria-hidden="true" />,
  },
];
