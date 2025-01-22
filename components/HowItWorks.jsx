import { howItWorksData } from "@/data/landing";

function HowItWorks() {
  return (
    <section className="flex mt-20 flex-col  mb-20 px-4 items-center gap-3 py-16 bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-10">How it works</h1>
      {howItWorksData &&
        howItWorksData.length > 0 &&
        howItWorksData.map((item, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-4 justify-center mb-5"
            >
              <div className="flex bg-gray-200  items-center rounded-full h-[40px] w-[40px] justify-center">
                <p>{item.icon}</p>
              </div>
              <p className="text-lg font-bold text-center">{item.title}</p>
              <p className="text-center">{item.description}</p>
            </div>
          );
        })}
    </section>
  );
}

export default HowItWorks;
