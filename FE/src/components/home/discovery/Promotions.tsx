"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Tag, message } from "antd";

/**
 * Promotions
 * - Hiển thị các ưu đãi đang có (demo)
 * - TODO: thay fetch demo bằng API: GET /api/promotions
 *
 */

type Promo = {
  id: number;
  title: string;
  subtitle?: string;
  image?: string;
  priceInfo?: string;
  badge?: string;
  expiresAt?: string;
};

export default function Promotions() {
  const [promos, setPromos] = useState<Promo[]>([]);

  useEffect(() => {
    // TODO: GET /api/promotions
    const demo: Promo[] = [
      {
        id: 1,
        title: "Early Bird — 20% off",
        subtitle: "Book 30 days in advance & save on selected rooms",
        image: "/promos/promo1.jpg",
        priceInfo: "From $79/night",
        badge: "Limited",
        expiresAt: "2025-12-31",
      },
      {
        id: 2,
        title: "Weekend Getaway",
        subtitle: "Extra perks for weekend stays (Fri–Sun)",
        image: "/promos/promo2.jpg",
        priceInfo: "From $99/night",
        badge: "Popular",
        expiresAt: "2026-03-01",
      },
      {
        id: 3,
        title: "Family Package",
        subtitle: "Kids stay free under 12 + complimentary breakfast",
        image: "/promos/promo3.jpg",
        priceInfo: "From $149/night",
        badge: "Family",
        expiresAt: "2026-06-30",
      },
    ];
    setPromos(demo);
  }, []);

  const handleBook = (promo: Promo) => {
    // TODO: redirect to booking with promo code or call API to apply
    message.info(`Apply promo: ${promo.title} (demo)`);
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Current Promotions</h3>
        <p className="text-sm text-gray-500">Limited time offers — grab them while they last</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {promos.map((p) => (
          <Card
            key={p.id}
            hoverable
            className="rounded-xl overflow-hidden"
            bodyStyle={{ padding: 0 }}
            style={{ borderRadius: 12 }}
            // AntD v5: variant default ok; avoid deprecated props
          >
            <div className="relative">
              <img
                src={p.image ?? "/promos/default.jpg"}
                alt={p.title}
                className="w-full h-44 object-cover"
              />
              {p.badge && (
                <Tag color="magenta" className="absolute top-3 left-3">
                  {p.badge}
                </Tag>
              )}
            </div>

            <div className="p-4">
              <h4 className="text-lg font-semibold">{p.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{p.subtitle}</p>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-800">{p.priceInfo}</div>
                <div className="flex items-center gap-2">
                  <Button type="primary" onClick={() => handleBook(p)}>
                    Book Now
                  </Button>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-3">Expires: {p.expiresAt}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
