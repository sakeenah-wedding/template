// EventCard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  CalendarPlus,
  X,
  Chrome,
  Apple,
  Calendar as CalendarIcon,
} from "lucide-react";
import { formatEventDate } from "@/lib/format-event-date";
import { useMotionPreset } from "@/lib/motion";

const Modal = ({ isOpen, onClose, children }) => {
  const fade = useMotionPreset("fade");
  const fadeUp = useMotionPreset("fadeUp");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={fade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className={cn("fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]")}
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[90%] max-w-sm",
            )}
          >
            <div
              className={cn(
                "bg-white transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 shadow-2xl border border-gray-100",
              )}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CalendarButton = ({ icon: Icon, label, onClick, className = "" }) => (
  <motion.button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-3 w-full p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors",
      className,
    )}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className={cn("w-5 h-5")} />
    <span className={cn("text-gray-700 font-medium")}>{label}</span>
  </motion.button>
);

/**
 * SingleEventCard component displays an event card with options to add the event
 * to various calendars (Google Calendar, Apple Calendar, and Outlook Calendar).
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.eventData - Object containing event data.
 * @param {string} props.eventData.date - The date of the event (expected format: YYYY-MM-DD).
 * @param {string} props.eventData.startTime - The start time of the event (expected format: HH:mm).
 * @param {string} props.eventData.endTime - The end time of the event (expected format: HH:mm).
 * @param {string} props.eventData.title - The title of the event.
 * @param {string} props.eventData.description - A description of the event.
 * @param {string} props.eventData.location - The location where the event takes place.
 * @param {string} props.eventData.timeZone - The time zone of the event.
 *
 * @example
 * const eventData = {
 *   date: '2023-10-15',
 *   startTime: '14:00',
 *   endTime: '16:00',
 *   title: 'Wedding Ceremony - Reception',
 *   description: 'Join us to celebrate the wedding ceremony and reception.',
 *   location: 'Sunset Gardens',
 *   timeZone: 'Asia/Jakarta'
 * };
 *
 * <SingleEventCard eventData={eventData} />
 *
 * @returns {JSX.Element} A JSX element representing the event card.
 */
const SingleEventCard = ({ eventData }) => {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const fadeUp = useMotionPreset("fadeUp");

  const googleCalendarLink = () => {
    const startDate = new Date(`${eventData.date}T${eventData.startTime}:00`);
    const endDate = new Date(`${eventData.date}T${eventData.endTime}:00`);

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, "");
    };

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}&ctz=${eventData.timeZone}`;
  };

  const generateICSContent = () => {
    const startDate = new Date(`${eventData.date}T${eventData.startTime}:00`);
    const endDate = new Date(`${eventData.date}T${eventData.endTime}:00`);

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
END:VEVENT
END:VCALENDAR`;
  };

  const downloadICSFile = () => {
    const icsContent = generateICSContent();
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${eventData.title.toLowerCase().replace(/ /g, "-")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={cn("relative")}>
      <motion.div
        className={cn(
          "bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4",
        )}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className={cn("flex justify-between items-center")}>
          <h3 className={cn("text-xl font-semibold text-gray-800")}>
            {eventData.title.split(" - ")[0]}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "text-rose-500 hover:text-rose-600 transition-colors",
            )}
            onClick={() => setShowCalendarModal(true)}
          >
            <CalendarPlus className={cn("w-5 h-5")} />
          </motion.button>
        </div>
        <div className={cn("space-y-3 text-gray-600")}>
          <div className={cn("flex items-center space-x-3")}>
            <Calendar className={cn("w-5 h-5 text-rose-500")} />
            <span>{formatEventDate(eventData.date)}</span>
          </div>
          <div className={cn("flex items-center space-x-3")}>
            <Clock className={cn("w-5 h-5 text-rose-500")} />
            <span>
              {eventData.startTime?.substring(0, 5) || eventData.startTime} -{" "}
              {eventData.endTime?.substring(0, 5) || eventData.endTime} WIB
            </span>
          </div>
          <div className={cn("flex items-center space-x-3")}>
            <MapPin className={cn("w-5 h-5 text-rose-500")} />
            <span>{eventData.location}</span>
          </div>
        </div>
      </motion.div>

      <Modal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      >
        <div className={cn("space-y-6 ")}>
          <div className={cn("flex justify-between  items-center")}>
            <h3 className={cn("text-xl font-semibold text-gray-800")}>
              Add to Calendar
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCalendarModal(false)}
              className={cn("text-gray-500 hover:text-gray-700")}
            >
              <X className={cn("w-5 h-5")} />
            </motion.button>
          </div>

          <div className={cn("space-y-3")}>
            <CalendarButton
              icon={(props) => (
                <Chrome {...props} className={cn("w-5 h-5 text-rose-500")} />
              )}
              label="Google Calendar"
              onClick={() => window.open(googleCalendarLink(), "_blank")}
            />

            <CalendarButton
              icon={(props) => (
                <Apple {...props} className={cn("w-5 h-5 text-gray-900")} />
              )}
              label="Apple Calendar"
              onClick={downloadICSFile}
            />

            <CalendarButton
              icon={(props) => (
                <CalendarIcon
                  {...props}
                  className={cn("w-5 h-5 text-blue-600")}
                />
              )}
              label="Outlook Calendar"
              onClick={downloadICSFile}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Main EventCards component that handles multiple events
const EventCards = ({ events }) => {
  return (
    <div className={cn("space-y-4")}>
      {events.map((event, index) => (
        <SingleEventCard key={index} eventData={event} />
      ))}
    </div>
  );
};

export default EventCards;
