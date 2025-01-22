"use Client";

import { Button } from "./ui/button";
import { Check } from "lucide-react";

function HeroSection() {
  return (
    <div className="pb-20 ">
      <section className="container pt-28  flex flex-col px-4 items-center  mx-auto ">
        <div className="flex mb-8 items-center justify-center gap-2 flex-col">
          <h1 className="text-[5vh] font-bold text-center font-mono">
            Simplify Your Finances:
          </h1>
          <h1 className="text-3xl text-blue-600 font-mono font-bold  mb-10">
            <span>Track</span>,<span>Manage</span>,<span>Succeed</span>
          </h1>
          <p className="text-center text-lg mb-10 text-gray-600">
            Take control of your <span className="text-black">finances</span>{" "}
            with ease. Our intuitive tracker helps you
            <span className="text-black">
              {" "}
              organize expenses, set budgets, and uncover savings
            </span>{" "}
            opportunities—all in one place.
          </p>
          <ul className="text-center  flex items-start justify-center flex-col">
            <li className="flex items-start gap-2 text-md ">
              <Check />
              Track expenses effortlessly.
            </li>
            <li className="flex items-center gap-2 text-md ">
              <Check />
              Set budgets and achieve goals.
            </li>
            <li className="flex items-center gap-2 text-md justify-center">
              <Check />
              Save smarter and faster.
            </li>
          </ul>
        </div>
        <Button size="lg" className="bg-blue-600 text-white text-lg py-8 px-10">
          Get Started
        </Button>
      </section>
    </div>
  );
}

export default HeroSection;
