import React from "react";
import { testimonialsData } from "@/data/landing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "./ui/card";

function HeroTesimonial() {
  return (
    <section className="flex px-4 mb-20 w-full gap-10 items-center justify-center flex-col ">
      <h1 className="text-2xl text-center font-bold">What ours users say</h1>
      <div className="flex flex-col md:flex-row gap-6 ">
        {" "}
        {testimonialsData &&
          testimonialsData.length > 0 &&
          testimonialsData.map((item, index) => {
            return (
              <Card key={index} className="py-10">
                <CardContent>
                  <div className="flex items-center gap-4">
                    {" "}
                    <div>
                      {" "}
                      <Avatar>
                        <AvatarImage src={item.image} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="font-bold text-lg">{item.name}</p>
                      <p>{item.role}</p>
                    </div>
                  </div>
                </CardContent>
                <CardContent>
                  <p className="">{item.quote}</p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </section>
  );
}

export default HeroTesimonial;
