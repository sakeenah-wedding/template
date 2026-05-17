import { useInvitation } from "./use-invitation";
import staticConfig from "@/config/config";

/**
 * Custom hook to access wedding configuration
 * Returns config from API if available, otherwise falls back to static config
 *
 * @returns {object} Wedding configuration data
 *
 * @example
 * const config = useConfig();
 * console.log(config.groomName, config.brideName);
 */
export function useConfig() {
  const { config } = useInvitation();

  // Return API config if available, otherwise static config
  return config || staticConfig.data;
}
