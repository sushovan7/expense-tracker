import { howItWorksData } from "@/data/landing";

function HowItWorks() {
  return (
    <section className=" mt-32 flex flex-col items-center justify-center  mb-20 px-4 gap-3 py-16 bg-gray-50">
      <h1 className="text-2xl text-center font-bold mb-10">How it works</h1>
      <div className="flex  flex-col md:flex-row md:justify-between gap-20 items-center bg-gray-50">
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
      </div>
    </section>
  );
}

export default HowItWorks;
