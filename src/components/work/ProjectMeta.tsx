import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectMeta({
  project,
  size = "md",
}: {
  project: Project;
  size?: "md" | "lg";
}) {
  return (
    <div>
      <div className="label flex flex-wrap items-center gap-x-4 gap-y-2">
        <span>{project.category}</span>
        <span className="label-muted">{project.year}</span>
        {project.isConcept && (
          <span className="concept-tag">Concept project</span>
        )}
      </div>
      <h3 className={`${size === "lg" ? "h-lg" : "h-md"} mt-4`}>
        {project.name}
      </h3>
      <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-relaxed">
        {project.summary}
      </p>
      <ul
        className="label label-muted mt-5 flex flex-wrap gap-x-5 gap-y-1"
        aria-label="Services"
      >
        {project.services.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <Link
        href={`/work/${project.slug}`}
        className="stretch label link-draw mt-6 inline-block text-base"
      >
        Explore<span className="sr-only"> {project.name}</span> project
      </Link>
    </div>
  );
}
