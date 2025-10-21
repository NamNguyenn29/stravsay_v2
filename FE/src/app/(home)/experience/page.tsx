"use client";

import { Carousel, Rate, Button } from "antd";

/**
 * ExperienceWithMyHotel
 * - Loại bỏ hoàn toàn CardHeader/CardContent/CardTitle (thay bằng div + Tailwind)
 * - Không cần lucide-react / shadcn
 * - Text tiếng Anh; comment tiếng Việt để dễ nối API
 */

const highlights = [
  {
    title: "Luxury Rooms with City View",
    description:
      "Experience breathtaking views and ultimate comfort in our elegantly designed rooms.",
    // dùng emoji thay icon để tránh dependency
    icon: "🛏️",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Premium Amenities",
    description:
      "Relax and recharge with our fitness center, rooftop infinity pool, and spa services.",
    icon: "💆",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Complimentary Breakfast & Coffee Bar",
    description:
      "Start your day with a delightful breakfast and freshly brewed premium coffee.",
    icon: "☕",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Convenient Transportation",
    description:
      "Enjoy free parking and airport shuttle service for a seamless travel experience.",
    icon: "🚗",
    image:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
  },
];

const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment:
      "The best hotel experience I’ve ever had. The staff were incredibly friendly and helpful!",
    image:
      "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Michael Chen",
    rating: 4,
    comment:
      "Beautiful rooms, great food, and the pool view was amazing. Highly recommend!",
    image:
      "https://randomuser.me/api/portraits/men/79.jpg",
  },
  {
    name: "Emily Davis",
    rating: 5,
    comment:
      "Loved the elegant design and hospitality. Will definitely come back next time.",
    image:
      "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "James Brown",
    rating: 4,
    comment:
      "A truly relaxing getaway with top-notch service and facilities. Worth every penny.",
    image:
      "https://randomuser.me/api/portraits/men/52.jpg",
  },
];

export default function ExperienceWithMyHotel() {
  // Tạo slides 2 reviews mỗi slide cho Carousel
  const slides: Array<typeof reviews> = [];
  for (let i = 0; i < reviews.length; i += 2) {
    slides.push(reviews.slice(i, i + 2));
  }

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* HERO */}
      <div
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative text-center text-white px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Experience with My Hotel
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Where comfort meets elegance — discover the art of hospitality in every detail.
          </p>
          {/* Start Your Journey button removed as requested */}
        </div>
      </div>

      {/* HIGHLIGHT FEATURES (zig-zag layout, alternating) */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        {highlights.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{item.icon}</div>
                <h2 className="text-2xl font-semibold">{item.title}</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
              {/* Ví dụ: sau này chèn link "Learn more" hoặc API */}
            </div>
          </div>
        ))}
      </section>

      {/* GUEST REVIEWS */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold">What Our Guests Say</h2>
          <p className="text-gray-600 mt-2">Real stories from people who experienced our hospitality.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel autoplay dots>
            {slides.map((pair, idx) => (
              <div key={idx} className="px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pair.map((r, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={r.image}
                          alt={r.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold">{r.name}</h4>
                            <Rate disabled defaultValue={r.rating} />
                          </div>
                          <p className="text-gray-700 italic mt-3">“{r.comment}”</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Founded in 2010, My Hotel has grown from a boutique retreat into a leading destination for travelers seeking comfort, authenticity, and a touch of luxury. We craft experiences that go beyond accommodation — where every guest feels at home.
          </p>
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
            alt="Our story"
            className="rounded-2xl shadow-lg mx-auto w-full md:w-3/4 object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-rose-600 to-blue-700 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book your next experience with us</h2>
          <p className="text-white/90 mb-6">Your perfect getaway awaits — discover your stay today.</p>
          <div className="flex justify-center">
            <Button type="default" size="large" onClick={() => (window.location.href = "/booking")}>
              Book Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
