import { MapPin } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";

const TouristSites = () => {
    // Refs for scroll container
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax Transforms
    const yTop = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const yBottom = useTransform(scrollYProgress, [0, 1], [150, -150]);

    // Imágenes reales de destinos turísticos del Guaviare
    const topImages = [
        "/images/destinos/cano-cristales.png",
        "/images/destinos/ciudad-de-piedra.jpg",
        "/images/destinos/pinturas-rupestres.jpg",
    ];

    const bottomImages = [
        "/images/destinos/cerros-mavekure.jpg",
        "/images/destinos/las-yuntas.jpg",
        "/images/destinos/pozo-naranja.jpg",
        "/images/destinos/pozo-verde.jpg",
    ];

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <section ref={containerRef} className="py-24 px-4 bg-gradient-to-br from-white to-green-50/50 overflow-hidden">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                        className="space-y-8"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>Destinos Imperdibles</span>
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-[#1f1f1f] leading-tight">
                            Explora la Magia del <span className="text-primary italic">Guaviare</span>
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed">
                            Descubre paisajes ancestrales donde la selva se encuentra con formaciones rocosas milenarias.
                            Nuestra guía turística te llevará a través de los tesoros ocultos de la región, desde
                            pinturas rupestres hasta ríos de colores.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col gap-4 border-l-2 border-primary/20 pl-6">
                            <h3 className="font-semibold text-xl text-[#1f1f1f]">Experiencias Únicas</h3>
                            <ul className="space-y-3">
                                {[
                                    "Serranía de la Lindosa y sus pinturas rupestres",
                                    "Avistamiento de delfines rosados en el río",
                                    "Baño en los pozos naturales y cascadas",
                                    "Recorridos por la Puerta de Orión"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>

                    {/* Right Images Grid with Parallax */}
                    <div className="relative">
                        {/* Top Row - Moved by useTransform (yTop) */}
                        <motion.div
                            style={{ y: yTop }}
                            className="flex gap-4 mb-4 justify-center md:justify-end"
                        >
                            {topImages.map((src, i) => (
                                <motion.div
                                    key={`top-${i}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    className="relative group overflow-hidden rounded-2xl shadow-lg w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-44 xl:h-44 cursor-pointer border-2 border-white bg-white"
                                >
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
                                    <img src={src} alt={`Turismo Guaviare ${i}`} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Bottom Row - Moved by useTransform (yBottom) - Different speed for depth */}
                        <motion.div
                            style={{ y: yBottom }}
                            className="flex gap-4 justify-center md:justify-end -ml-12 md:-ml-0"
                        >
                            {bottomImages.map((src, i) => (
                                <motion.div
                                    key={`bottom-${i}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (i + 3) * 0.08 }}
                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                    className="relative group overflow-hidden rounded-2xl shadow-lg w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 cursor-pointer border-2 border-white bg-white"
                                >
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10" />
                                    <img src={src} alt={`Turismo Guaviare ${i + 3}`} className="w-full h-full object-cover" />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Decorative blob */}
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl opacity-50 rounded-full"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TouristSites;
