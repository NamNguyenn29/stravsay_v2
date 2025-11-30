"use client";

import Image from "next/image";
import { Wifi, Car, Utensils, Dumbbell, Coffee } from "lucide-react";

export default function DiscoveryPage() {
  const rooms = [
    {
      id: 1,
      name: "Deluxe Ocean View",
      price: 1200000,
      image: "/rooms/room1.jpg",
      desc: "A luxurious sea-view room featuring a king-size bed and private balcony.",
    },
    {
      id: 2,
      name: "Superior City View",
      price: 900000,
      image: "/rooms/room2.jpg",
      desc: "A cozy room with stunning city views, ideal for short getaways.",
    },
    {
      id: 3,
      name: "Family Suite",
      price: 1500000,
      image: "/rooms/room3.jpg",
      desc: "Spacious suite with two bedrooms and a separate living area for families.",
    },
  ];

  const promotions = [
    {
      id: 1,
      title: "Weekend Escape – Save 20%",
      desc: "Book your stay from Friday to Sunday and enjoy 20% off.",
      image: "/promotions/promo1.jpg",
    },
    {
      id: 2,
      title: "Summer Special Offer",
      desc: "Stay 3 nights and get the 4th night for free this summer season.",
      image: "/promotions/promo2.jpg",
    },
  ];

  const services = [
    {
      id: 1,
      icon: Wifi,
      name: "Free Wi-Fi",
      desc: "High-speed internet available throughout the hotel.",
    },
    {
      id: 2,
      icon: Car,
      name: "Airport Shuttle",
      desc: "Complimentary airport pickup and drop-off services.",
    },
    {
      id: 3,
      icon: Utensils,
      name: "In-House Restaurant",
      desc: "Taste premium local and international cuisine.",
    },
    {
      id: 4,
      icon: Dumbbell,
      name: "Fitness Center",
      desc: "Fully equipped gym for your daily workout routine.",
    },
    {
      id: 5,
      icon: Coffee,
      name: "Coffee Lounge",
      desc: "Relax and enjoy handcrafted coffee and pastries.",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- ROOMS SECTION ---------- */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Discover Our Rooms</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-5 py-4">
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p className="text-gray-600 text-sm mt-1 mb-3">{room.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-indigo-600">
                    {room.price}đ/night
                  </span>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PROMOTIONS SECTION ---------- */}
      <section className="bg-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Exclusive Promotions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="relative overflow-hidden rounded-2xl group shadow-md"
              >
                <Image
                  src={promo.image}
                  alt={promo.title}
                  width={600}
                  height={400}
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-semibold">{promo.title}</h3>
                  <p className="text-gray-200 mt-1">{promo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SERVICES SECTION ---------- */}
      <section className="bg-gray-100 px-6 py-14">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Our Services</h2>
          <div className="grid md:grid-cols-5 sm:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <Icon className="w-10 h-10 text-indigo-500 mb-3" />
                  <h4 className="font-semibold text-gray-800">{service.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
