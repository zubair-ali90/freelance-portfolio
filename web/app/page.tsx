import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";
import { getPublishedProjects } from "@/lib/published-projects";
import "./home-experience.css";

export const instant = false;

export const metadata: Metadata = {
  title: "Zubair Ali | 3D Artist & Interactive Developer",
  description:
    "Freelance 3D artist and interactive developer — product CGI, character animation, immersive spaces, configurators, and AR. Hire on Upwork.",
};

export default async function HomePage() {
  const projects = await getPublishedProjects();
  return (
    <main>
      <HomeExperience projects={projects} />
    </main>
  );
}
