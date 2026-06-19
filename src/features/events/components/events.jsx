import EventCards from "@/features/events/components/events-card";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function Events() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  return (
    <>
      {/* Event Section */}
      <section
        id="event"
        className={cn("min-h-screen relative overflow-hidden")}
      >
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn("relative z-10 container mx-auto px-4 py-20")}
        >
          {/* Section Header */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn("text-center space-y-4 mb-16")}
          >
            <motion.span
              variants={fadeUp}
              className={cn("inline-block text-rose-500 font-medium mb-2")}
            >
              Catat Tanggal Penting Ini
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className={cn(
                "text-4xl md:text-5xl font-serif text-gray-800 leading-tight",
              )}
            >
              Rangkaian Acara Pernikahan
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className={cn("text-gray-500 max-w-md mx-auto")}
            >
              Kami Mengundang Anda untuk Merayakan Hari Istimewa Sebagai Awal
              Perjalanan Cinta Kami
            </motion.p>

            {/* Decorative Line */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-4 mt-6")}
            >
              <div className={cn("h-[1px] w-12 bg-rose-200")} />
              <div className={cn("text-rose-400")}>
                <Heart className={cn("w-4 h-4")} fill="currentColor" />
              </div>
              <div className={cn("h-[1px] w-12 bg-rose-200")} />
            </motion.div>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn("max-w-2xl mx-auto")}
          >
            <EventCards events={config.agenda} />
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
