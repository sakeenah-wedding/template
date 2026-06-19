import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import {
  useMotionPreset,
  staggerContainer,
  LOOP,
  useReducedMotionFlag,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const reduceMotion = useReducedMotionFlag();
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");

  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="visible"
      className={cn("min-h-screen relative overflow-hidden")}
    >
      {/* Decorative Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white",
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2",
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2",
        )}
      />

      {/* Main Content */}
      <div
        className={cn(
          "relative z-10 min-h-screen flex flex-col items-center justify-center px-4",
        )}
      >
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className={cn("w-full max-w-md")}
        >
          {/* Card Container */}
          <div
            className={cn(
              "backdrop-blur-sm bg-white/50 p-6 sm:p-8 md:p-10 rounded-2xl border border-rose-100/50 shadow-xl",
            )}
          >
            {/* Top Decorative Line */}
            <div
              className={cn(
                "flex items-center justify-center gap-3 mb-6 sm:mb-8",
              )}
            >
              <div className={cn("h-px w-12 sm:w-16 bg-rose-200/50")} />
              <div className={cn("w-2 h-2 rounded-full bg-rose-300")} />
              <div className={cn("h-px w-12 sm:w-16 bg-rose-200/50")} />
            </div>

            {/* Date and Time */}
            <motion.div
              variants={fadeUp}
              className={cn("flex flex-col gap-4 mb-6 sm:mb-8 items-center")}
            >
              <div
                className={cn(
                  "inline-flex flex-col items-center space-y-1 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl",
                )}
              >
                <Calendar className={cn("w-5 h-5 text-rose-400")} />
                <p className={cn("text-gray-700 font-medium")}>
                  {formatEventDate(config.date)}
                </p>
              </div>

              <div
                className={cn(
                  "inline-flex flex-col items-center space-y-1 bg-white/80 px-4 sm:px-6 py-2 sm:py-3 rounded-xl",
                )}
              >
                <Clock className={cn("w-5 h-5 text-rose-400")} />
                <p className={cn("text-gray-700 font-medium")}>{config.time}</p>
              </div>
            </motion.div>

            {/* Couple Names */}
            <motion.div
              variants={fadeUp}
              className={cn("text-center space-y-4")}
            >
              <div className={cn("space-y-2")}>
                <h1
                  className={cn(
                    "text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800 leading-tight",
                  )}
                >
                  {config.groomName}
                  <span className={cn("text-rose-400 mx-2 sm:mx-3")}>&</span>
                  {config.brideName}
                </h1>
                <div className={cn("h-px w-16 sm:w-24 mx-auto bg-rose-200")} />
              </div>
            </motion.div>

            {/* Open Invitation Button */}
            <motion.div variants={fadeUp} className={cn("mt-6 sm:mt-8")}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInvitation}
                className={cn(
                  "group relative w-full bg-rose-500 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-xl font-medium shadow-lg hover:bg-rose-600 transition-all duration-200",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 flex items-center justify-center gap-2",
                  )}
                >
                  <span>Buka Undangan</span>
                  <motion.span
                    animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { repeat: Infinity, duration: LOOP.nudge }
                    }
                  >
                    →
                  </motion.span>
                </span>
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                  )}
                />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
