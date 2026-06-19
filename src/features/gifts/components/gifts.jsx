import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Copy, Gift, CheckCircle, Wallet, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMotionPreset, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function Gifts() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");
  const scaleIn = useMotionPreset("scaleIn");

  // Set animation to run once on component mount
  useEffect(() => {
    setHasAnimated(true);
  }, []);

  const copyToClipboard = (text, bank) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(bank);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  // Hide section if config or banks data is not set
  if (!config?.banks || config.banks.length === 0) {
    return null;
  }

  return (
    <>
      <section
        id="gifts"
        className={cn("min-h-screen relative overflow-hidden")}
      >
        <div className={cn("container mx-auto px-4 py-20 relative z-10")}>
          {/* Section Header */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            className={cn("text-center space-y-4 mb-16")}
          >
            <motion.span
              variants={fadeUp}
              className={cn("inline-block text-rose-500 font-medium")}
            >
              Hadiah Pernikahan
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className={cn("text-4xl md:text-5xl font-serif text-gray-800")}
            >
              Berikan Hadiah
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-4 pt-4")}
            >
              <div className={cn("h-[1px] w-12 bg-rose-200")} />
              <Gift className={cn("w-5 h-5 text-rose-400")} />
              <div className={cn("h-[1px] w-12 bg-rose-200")} />
            </motion.div>

            {/* Message Container */}
            <motion.div
              variants={fade}
              className={cn("space-y-4 max-w-md mx-auto")}
            >
              {/* Arabic InsyaAllah */}
              <p className={cn("font-arabic text-xl text-gray-800")}>
                إن شاء الله
              </p>

              {/* Main Message */}
              <p className={cn("text-gray-600 leading-relaxed")}>
                Insya Allah, Kami Akan Menyalurkan Semua Hadiah yang Diberikan
                ke Beberapa Masjid dan Lembaga yang Membutuhkan
              </p>

              {/* Arabic Dua */}
              <div className={cn("space-y-2")}>
                <p className={cn("font-arabic text-lg text-gray-800")}>
                  جزاكم الله خيرا وبارك الله فيكم
                </p>
                <p className={cn("text-gray-600 italic text-sm")}>
                  Jazakumullahu khairan, Barakallah fiikum
                </p>
              </div>
            </motion.div>

            {/* Optional: Additional Decorative Element */}
            <motion.div
              variants={scaleIn}
              className={cn("flex items-center justify-center gap-3 pt-4")}
            >
              <div className={cn("h-px w-8 bg-rose-200/50")} />
              <div className={cn("w-1.5 h-1.5 rounded-full bg-rose-300")} />
              <div className={cn("h-px w-8 bg-rose-200/50")} />
            </motion.div>
          </motion.div>

          {/* Bank Accounts Grid */}
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            animate={hasAnimated ? "visible" : "hidden"}
            className={cn("max-w-2xl mx-auto grid gap-6")}
          >
            {config.banks.map((account) => (
              <motion.div
                key={account.accountNumber}
                variants={fadeUp}
                className={cn("relative group")}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-rose-100/50 to-pink-100/50 rounded-2xl transform transition-transform group-hover:scale-105 duration-300",
                  )}
                />
                <div
                  className={cn(
                    "relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl border border-rose-100/50 shadow-lg",
                  )}
                >
                  <div className={cn("flex items-center justify-between")}>
                    <div className={cn("flex items-center space-x-4")}>
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg bg-white p-2 shadow-sm",
                        )}
                      >
                        <Building2
                          className={cn("w-full h-full text-rose-500")}
                        />
                      </div>
                      <div>
                        <h3 className={cn("font-medium text-gray-800")}>
                          {account.bank}
                        </h3>
                        <p className={cn("text-sm text-gray-500")}>
                          {account.accountName}
                        </p>
                      </div>
                    </div>
                    <Wallet className={cn("w-5 h-5 text-rose-400")} />
                  </div>

                  <div className={cn("mt-4")}>
                    <div
                      className={cn(
                        "flex items-center justify-between bg-gray-50/80 px-4 py-3 rounded-lg",
                      )}
                    >
                      <p className={cn("font-mono text-gray-700")}>
                        {account.accountNumber}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          copyToClipboard(account.accountNumber, account.bank)
                        }
                        className={cn(
                          "flex items-center space-x-1 text-rose-500 hover:text-rose-600",
                        )}
                      >
                        {copiedAccount === account.bank ? (
                          <CheckCircle className={cn("w-4 h-4")} />
                        ) : (
                          <Copy className={cn("w-4 h-4")} />
                        )}
                        <span className={cn("text-sm")}>
                          {copiedAccount === account.bank ? "Copied!" : "Copy"}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
