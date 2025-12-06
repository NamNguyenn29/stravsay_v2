"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wifi, Car, Utensils, Dumbbell, Coffee } from "lucide-react";
import { roomService } from "@/services/roomService";
import { Room } from "@/model/Room";

export default function DiscoveryPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
   const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await roomService.getRooms(1, 20);
      
      console.log('🔍 Full API Response:', response);
      console.log('📦 Response data:', response.data);
      
      const data = response.data;
      
      // Check if data exists and has list
      if (data && data.list && Array.isArray(data.list)) {
        const roomList: Room[] = data.list;
        console.log('📋 Room list from API:', roomList);
        console.log('📊 Total rooms:', roomList.length);
        
        if (roomList.length > 0) {
          setRooms(roomList);
          console.log('✅ Set rooms to state:', roomList.length);
        } else {
          console.log('⚠️ Room list is empty');
          setError('No rooms found in database');
        }
      } else {
        console.log('❌ Invalid data structure:', data);
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('💥 Error loading rooms:', err);
      if (err instanceof Error) {
        console.error('📛 Error message:', err.message);
        setError('Failed to load rooms: ' + err.message);
      } else {
        setError('Failed to load rooms. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadRooms();
  }, []);

 
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getFirstImage = (imageUrls: string[]): string => {
    if (!imageUrls || imageUrls.length === 0) {
      return '/placeholder-room.jpg';
    }
    return imageUrls[0];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ---------- ROOMS SECTION ---------- */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Discover Our Rooms</h1>
        
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-10 text-gray-600">
            No rooms available at the moment.
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">Found {rooms.length} available rooms</p>
            <div className="grid md:grid-cols-3 gap-6">
              {rooms.slice(0,6).map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  {/* Room Image */}
                  <div className="relative h-56 w-full bg-gray-200">
                    <Image
                      src={getFirstImage(room.imageUrl)}
                      alt={room.roomName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {room.typeName}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="px-5 py-4">
                    <h3 className="text-lg font-semibold mb-2 text-rose-500">{room.roomName}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.description || `Comfortable room with ${room.bedType}`}
                    </p>
                    
                    {/* 4 BLOCKS THÔNG TIN */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Bed Type</p>
                        <p className="text-sm font-semibold text-gray-800">{room.bedType}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Space</p>
                        <p className="text-sm font-semibold text-gray-800">{room.space}m²</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Capacity</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {room.adult} Adults, {room.children} Kids
                        </p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-xs text-gray-500">Floor</p>
                        <p className="text-sm font-semibold text-gray-800">Floor {room.floor}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-t pt-3 flex justify-between items-center">
                      <div>
                        <span className="text-lg font-semibold text-rose-500">
                          {formatPrice(room.basePrice)}
                        </span>
                        <span className="text-gray-500 text-sm">/night</span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
                  <Icon className="w-10 h-10 text-rose-500 mb-3" />
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