"use client";

import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";

/**
 * - Demo data; TODO: replace with GET /api/suggestions
 */

type Suggestion = {
  id: number;
  title: string;
  excerpt?: string;
  image?: string;
  duration?: string;
  difficulty?: string;
};

export default function TravelSuggestions() {
  const [items, setItems] = useState<Suggestion[]>([]);

  useEffect(() => {
    // TODO: GET /api/suggestions
    const demo: Suggestion[] = [
      {
        id: 1,
        title: "City Food Tour",
        excerpt: "Taste local specialties with a guided street-food walk.",
        image: "/suggestions/food-tour.jpg",
        duration: "3h",
      },
      {
        id: 2,
        title: "Sunset Boat Trip",
        excerpt: "Relax on a private boat with drinks and sunset views.",
        image: "/suggestions/boat-trip.jpg",
        duration: "2h",
      },
      {
        id: 3,
        title: "Countryside Cycling",
        excerpt: "Easy-paced cycling through scenic villages.",
        image: "/suggestions/cycling.jpg",
        duration: "4h",
      },
    ];
    setItems(demo);
  }, []);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Travel Suggestions</h3>
        <p className="text-sm text-gray-500">Short experiences to add to your stay</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((s) => (
          <Card key={s.id} hoverable className="rounded-xl" bodyStyle={{ padding: 0 }}>
            <img src={s.image ?? "/suggestions/default.jpg"} alt={s.title} className="w-full h-44 object-cover rounded-t-xl" />
            <div className="p-4">
              <h4 className="font-semibold">{s.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{s.excerpt}</p>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">{s.duration}</div>
                <Button type="default">See details</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
