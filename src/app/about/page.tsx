import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import Benefits from "@/components/ui/Benefits"
import TeamGallery from "@/components/ui/TeamGallery"
import { cx } from "@/lib/utils"
import {
  RiCheckLine,
  RiPulseLine,
  RiHeartPulseLine,
} from "@remixicon/react"
import Balancer from "react-wrap-balancer"

export default function About() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade text-center"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Health AI</Badge>
        <h1
          id="about-overview"
          className="mx-auto mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>Free AI Fitness Assessment</Balancer>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          Discover personalized fitness insights powered by artificial intelligence.
          Our quick assessment guides you toward healthier habits.
        </p>
        <div className="mx-auto mt-6 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button className="h-10 w-full sm:w-fit">Start Assessment</Button>
        </div>
        <ul className="mx-auto mt-6 max-w-md text-left text-gray-700 dark:text-gray-400">
          <li className="flex items-center gap-x-3 py-1.5">
            <RiCheckLine className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Takes less than 5 minutes</span>
          </li>
          <li className="flex items-center gap-x-3 py-1.5">
            <RiPulseLine className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Backed by proven health metrics</span>
          </li>
          <li className="flex items-center gap-x-3 py-1.5">
            <RiHeartPulseLine className="size-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span>Personalized recommendations</span>
          </li>
        </ul>
      </section>
      <TeamGallery />
      <Benefits />
      <section aria-labelledby="vision-title" className="mx-auto mt-40">
        <h2
          id="vision-title"
          className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
        >
          Our Vision
        </h2>
        <div className="mt-6 max-w-prose space-y-4 text-gray-600 dark:text-gray-400">
          <p className="text-lg leading-8">
            We envision a world where staying healthy is simple and accessible.
            By blending cutting-edge AI with personalized recommendations, we
            transform your health data into actionable guidance.
          </p>
          <p className="text-lg leading-8">
            Our mission is to break down the complexities of fitness tracking so
            you can focus on living well. We strive to give everyone the tools
            they need to achieve long-term well-being and an active lifestyle.
          </p>
          <p
            className={cx(
              "w-fit rotate-3 font-handwriting text-3xl text-indigo-600 dark:text-indigo-400",
            )}
          >
            – Alex and Robin
          </p>
        </div>
        <Button className="mt-32 h-10 w-full shadow-xl shadow-indigo-500/20">
          View Open Roles
        </Button>
      </section>
    </div>
  )
}
