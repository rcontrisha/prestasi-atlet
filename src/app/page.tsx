"use client";

import React, { JSX } from "react";
import { useRouter } from "next/navigation";
import { Component as NavbarComponent } from "../components/navbar";
import { Card, CardContent } from "../components/card";

const HomePage = (): JSX.Element => {
  const router = useRouter();

  // Sports events data
  const sportsEvents = [
    {
      key: "popda",
      title: "POPDA",
      description: "Pekan Olahraga Pelajar Daerah",
      image: "/images/Popda Cover.png",
    },
    {
      key: "peparpeda",
      title: "PEPARPEDA",
      description: "Pekan Paralimpik Pelajar Daerah",
      image: "/images/image 2.png",
    },
    {
      key: "kko",
      title: "KKO",
      description: "Kelas Khusus Olahraga",
      image: "",
    },
    {
      key: "o2sn_prov",
      title: "O2SN Provinsi DIY",
      description: "Olimpiade Olahraga Siswa Nasional",
      image: "/images/o2sn.png",
    },
    {
      key: "o2sn_nasional",
      title: "O2SN Nasional",
      description: "Olimpiade Olahraga Siswa Nasional",
      image: "/images/o2sn.png",
    },
  ];

  const handleCardClick = (eventKey: string) => {
    router.push(`/event/${eventKey}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarComponent />
      <hr
        style={{
          border: "none",
          height: "1px",
          backgroundColor: "#333",
          borderRadius: "2px",
          marginTop: "2px",
        }}
      />
      <main className="p-8 text-gray-800 dark:text-white">
        {/* Welcome Section */}
        <section className="flex flex-col items-center text-center px-4 mt-32 mb-24">
          <h1 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[34px] tracking-[-0.68px] leading-[37.4px] max-w-[900px]">
            Selamat Datang di Sentra Pembinaan Olahragawan Muda <br />
            Kota Yogyakarta
          </h1>
          <p className="[font-family:'Inter',Helvetica] font-normal text-[#444444] text-base tracking-[0] leading-6 max-w-[708px] mt-6">
            Sentra Pembinaan Olahragawan Muda (SPOM) Kota Yogyakarta merupakan
            wadah untuk mengembangkan potensi dan prestasi atlet muda secara
            berkelanjutan. Melalui program pelatihan yang terstruktur dan
            pembinaan karakter, kami berkomitmen mencetak generasi atlet yang
            tangguh, berprestasi, dan mengharumkan nama daerah di tingkat
            regional maupun nasional.
          </p>
        </section>

        {/* Sports Events Section */}
        <section className="flex flex-col items-center px-4 mb-24">
          <div className="text-center mb-10">
            <h2 className="[font-family:'Inter',Helvetica] font-semibold text-black text-[34px] tracking-[-0.68px] leading-[37.4px]">
              Ajang Olahraga yang diikuti
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8 max-w-[760px]">
            {sportsEvents.map((event, index) => (
              <Card
                key={index}
                className="w-[232px] border-none shadow-none cursor-pointer"
                onClick={() => handleCardClick(event.key)}
              >
                <CardContent className="p-0">
                  <div className="relative w-full h-[232px] rounded-lg overflow-hidden shadow-[0px_4px_8px_#0000001a,0px_15px_15px_#00000017,0px_33px_20px_#0000000d,0px_59px_24px_#00000003,0px_93px_26px_transparent]">
                    {event.image ? (
                      <img
                        className="absolute w-full h-full top-0 left-0 object-cover"
                        alt={event.title}
                        src={event.image}
                      />
                    ) : (
                      <div className="bg-gray-300 w-full h-full flex items-center justify-center text-sm text-gray-600">
                        Belum Ada Gambar
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="[font-family:'Inter',Helvetica] font-medium text-black text-xl tracking-[0] leading-[30px]">
                      {event.title}
                    </h3>
                    <p className="[font-family:'Inter',Helvetica] font-normal text-[#444444] text-base tracking-[0] leading-6">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
