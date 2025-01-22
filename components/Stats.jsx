import { statsData } from "@/data/landing";
import { Card } from "./ui/card";

function Stats() {
  return (
    <section className="flex mb-10 px-4 items-center justify-around gap-3 py-16 bg-gray-50">
      {statsData &&
        statsData.length > 0 &&
        statsData.map((stat, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <p className="text-lg md:text-3xl  text-blue-600 font-bold text-center">
                {stat.value}
              </p>
              <p className=" text-sm  md:text-lg text-center">{stat.label}</p>
            </div>
          );
        })}
    </section>
  );
}

export default Stats;
