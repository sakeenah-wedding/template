import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  EASE,
  useReducedMotionFlag,
} from "@/lib/motion";

export default function Hero() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [guestName, setGuestName] = useState("");
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  useEffect(() => {
    // Get guest name from localStorage
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
    }
  }, []);

  const CountdownTimer = ({ targetDate }) => {
    const calculateTimeLeft = useCallback(() => {
      const difference = +new Date(targetDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
          jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
          menit: Math.floor((difference / 1000 / 60) % 60),
          detik: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        {Object.keys(timeLeft).map((interval) => (
          <motion.div
            key={interval}
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100"
          >
            <span className="text-xl sm:text-2xl font-bold text-rose-600">
              {timeLeft[interval]}
            </span>
            <span className="text-xs text-gray-500 capitalize">{interval}</span>
          </motion.div>
        ))}
      </div>
    );
  };

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 8,
        color:
          i % 3 === 0
            ? "text-rose-400"
            : i % 3 === 1
              ? "text-pink-400"
              : "text-red-400",
        initialX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
        animateX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
      })),
    );

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: typeof window !== "undefined" ? window.innerHeight : 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -100,
            }}
            transition={{
              duration: LOOP.float,
              repeat: Infinity,
              delay: i * 0.8,
              ease: EASE.out,
            }}
            className="absolute"
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 4}px`,
                height: `${heart.size * 4}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center relative overflow-hidden"
      >
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="space-y-6 relative z-10"
        >
          <motion.div variants={scaleIn} className="inline-block mx-auto">
            <span className="px-4 py-1 text-sm bg-rose-50 text-rose-600 rounded-full border border-rose-200">
              Catat Tanggal Penting Ini
            </span>
          </motion.div>

          <div className="space-y-4">
            <motion.p
              variants={fade}
              className="text-gray-500 font-light italic text-base sm:text-lg"
            >
              InsyaAllah Kami Akan Menikah
            </motion.p>
            <motion.h2
              variants={scaleIn}
              className="text-3xl sm:text-5xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600"
            >
              {config.groomName} & {config.brideName}
            </motion.h2>
          </div>

          <motion.div variants={fadeUp} className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-white/50 backdrop-blur-md rounded-2xl" />

            <div className="relative px-4 sm:px-8 py-8 sm:py-10 rounded-2xl border border-rose-100/50">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px">
                <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
              </div>

              <div className="space-y-6 text-center">
                <div className="space-y-3">
                  <motion.div
                    variants={fade}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      {formatEventDate(config.date, "full")}
                    </span>
                  </motion.div>

                  <motion.div
                    variants={fade}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-4 h-4 text-rose-400" />
                    <span className="text-gray-700 font-medium text-sm sm:text-base">
                      {config.time}
                    </span>
                  </motion.div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-8 sm:w-12 bg-rose-200/50" />
                  <div className="w-2 h-2 rounded-full bg-rose-200" />
                  <div className="h-px w-8 sm:w-12 bg-rose-200/50" />
                </div>

                <motion.div variants={fade} className="space-y-2">
                  <p className="text-gray-500 font-serif italic text-sm">
                    Kepada Yth.
                  </p>
                  <p className="text-gray-600 font-medium text-sm">
                    Bapak/Ibu/Saudara/i
                  </p>
                  <p className="text-rose-500 font-semibold text-lg">
                    {guestName || "Tamu Undangan"}
                  </p>
                </motion.div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px">
                <div className="w-20 sm:w-32 h-[2px] bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
              </div>
            </div>

            <div className="absolute -top-2 -right-2 w-16 sm:w-24 h-16 sm:h-24 bg-rose-100/20 rounded-full blur-xl" />
            <div className="absolute -bottom-2 -left-2 w-16 sm:w-24 h-16 sm:h-24 bg-rose-100/20 rounded-full blur-xl" />
          </motion.div>

          <CountdownTimer targetDate={config.date} />

          <div className="pt-6 relative">
            {!reduceMotion && <FloatingHearts />}
            <motion.div
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: LOOP.pulse,
                      repeat: Infinity,
                      ease: EASE.inOut,
                    }
              }
            >
              <Heart
                className="w-10 sm:w-12 h-10 sm:h-12 text-rose-500 mx-auto"
                fill="currentColor"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
