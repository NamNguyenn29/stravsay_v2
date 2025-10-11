"use client";
import Image from "next/image";
import { motion } from "framer-motion";

const services = [
    {
        name: "The Gym",
        description: "Modern fitness center with ocean view and premium equipment.",
        image: "/thegym.png",
    },
    {
        name: "Poolside Bar",
        description: "Enjoy tropical cocktails with a sunset view by the pool.",
        image: "/bar.png",
    },
    {
        name: "The Spa",
        description: "Relax and rejuvenate with our signature treatments.",
        image: "/spa.png",
    },
    {
        name: "Swimming Pool",
        description: "Infinity pool overlooking the ocean for ultimate relaxation.",
        image: "/pool.png",
    },
    {
        name: "Restaurant",
        description: "Experience fine dining with gourmet cuisine and ocean breeze.",
        image: "/restaurant.png",
    },
    {
        name: "Laundry",
        description: "Fast, fresh, and professional laundry service available 24/7.",
        image: "/laundry.png",
    },
];

export default function OurServicePage() {
    return (
        // min-h-creen : chieu cao tieu thieu = view port cho trang co cam gia day
        <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
                <p className="text-gray-500 mb-12">
                    We want your stay at our lush hotel to be truly unforgettable.  That is why we give special attention to all of your needs so
                    that we can ensure an experience quite unique.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {services.map((service, i) => (
                        <motion.div
                            key={service.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                        >
                            <Image
                                src={service.image}
                                alt={service.name}
                                width={600}
                                height={400}
                                className="object-cover w-full h-[350px] transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                            <div className="absolute bottom-6 left-6 text-left text-white z-10">
                                <h3 className="text-2xl font-semibold mb-2">{service.name}</h3>
                                <p className="text-sm text-gray-200 max-w-sm">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    );
}
