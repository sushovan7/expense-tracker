import { featuresData } from "@/data/landing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function HeroFeatures() {
  return (
    <section className="flex px-4 w-full gap-10 items-center justify-center flex-col ">
      <h1 className="text-2xl text-center font-bold">
        Everything you need to manage your finances
      </h1>
      <div className="flex flex-col gap-6 w-full">
        {" "}
        {featuresData &&
          featuresData.length > 0 &&
          featuresData.map((feature, index) => {
            return (
              <Card key={index}>
                <CardHeader>{feature.icon}</CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">{feature.title}</p>
                </CardContent>
                <CardFooter>
                  <p>{feature.description}</p>
                </CardFooter>
              </Card>
            );
          })}
      </div>
    </section>
  );
}

export default HeroFeatures;
