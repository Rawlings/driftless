import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "RUI - Visual Design Editor" },
    { name: "description", content: "Design and style interfaces visually with RUI." },
  ];
}

export default function Home() {
  return <Welcome />;
}
