import React, { useState, useEffect } from 'react';
import styles from './FeedingBanner.module.css';

interface FeedingEvent {
  time: string;
  animal: string;
  location: 'Orientarium' | 'Ogród Zewnętrzny';
  note?: string;
}

const FEEDING_SCHEDULE: FeedingEvent[] = [
  // Orientarium
  { time: '11:00', animal: 'Kąpiel Słoni', location: 'Orientarium' },
  { time: '11:30', animal: 'Żółwie Brunatne', location: 'Orientarium' },
  { time: '12:00', animal: 'Nurkowania', location: 'Orientarium', note: 'Środy' },
  { time: '12:30', animal: 'Karpie Koi', location: 'Orientarium', note: 'Maj–Wrzesień' },
  { time: '13:00', animal: 'Orangutany', location: 'Orientarium' },
  { time: '13:30', animal: 'Niedźwiedź Malajski', location: 'Orientarium' },
  { time: '14:00', animal: 'Binturongi', location: 'Orientarium' },
  { time: '14:30', animal: 'Rekiny', location: 'Orientarium', note: 'Wtorki i Piątki' },
  { time: '15:30', animal: 'Wyderki Orientalne', location: 'Orientarium' },
  { time: '17:30', animal: 'Kąpiel Słoni', location: 'Orientarium' },

  // Ogród Zewnętrzny
  { time: '11:45', animal: 'Pazurkowce', location: 'Ogród Zewnętrzny', note: 'Maj–Wrzesień' },
  { time: '12:00', animal: 'Leniwce', location: 'Ogród Zewnętrzny' },
  { time: '12:30', animal: 'Arirania', location: 'Ogród Zewnętrzny', note: 'Maj–Wrzesień' },
  { time: '12:45', animal: 'Lemury Katta', location: 'Ogród Zewnętrzny' },
  { time: '13:00', animal: 'Koendu', location: 'Ogród Zewnętrzny' },
  { time: '13:30', animal: 'Kapibary', location: 'Ogród Zewnętrzny' },
  { time: '14:30', animal: 'Pandy Małe', location: 'Ogród Zewnętrzny' },
  { time: '14:45', animal: 'Lemury Wari', location: 'Ogród Zewnętrzny' },
  { time: '16:00', animal: 'Galidie', location: 'Ogród Zewnętrzny', note: 'Maj–Wrzesień' },
  { time: '16:30', animal: 'Surykatki', location: 'Ogród Zewnętrzny' },
  { time: '17:00', animal: 'Pawilon Nocny', location: 'Ogród Zewnętrzny' },
  { time: '18:00', animal: 'Tamanduy', location: 'Ogród Zewnętrzny' },
];

export const FeedingBanner: React.FC = () => {
  const [nextFeeding, setNextFeeding] = useState<FeedingEvent | null>(null);

  useEffect(() => {
    const updateNextFeeding = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Sort chronologically by time (e.g., 11:00 before 11:45)
      const sortedSchedule = [...FEEDING_SCHEDULE].sort((a, b) => {
        const [aH, aM] = a.time.split(':').map(Number);
        const [bH, bM] = b.time.split(':').map(Number);
        return aH * 60 + aM - (bH * 60 + bM);
      });

      // Find the earliest upcoming event
      const upcoming = sortedSchedule.find((event) => {
        const [hours, minutes] = event.time.split(':').map(Number);
        const eventMinutes = hours * 60 + minutes;
        return eventMinutes > currentMinutes;
      });

      setNextFeeding(upcoming || null);
    };

    updateNextFeeding();
    const interval = setInterval(updateNextFeeding, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!nextFeeding) {
    return (
      <div className={styles.feedingBadge}>
        <span className={styles.icon}>🍖</span>
        <span>Brak kolejnych karmień na dziś</span>
      </div>
    );
  }

  return (
    <div className={styles.feedingBadge}>
      <span className={styles.pulseDot}></span>
      <span className={styles.label}>Następne karmienie:</span>
      <strong className={styles.time}>{nextFeeding.time}</strong>
      <span className={styles.divider}>•</span>
      <span className={styles.animal}>{nextFeeding.animal}</span>
      <span className={styles.location}>({nextFeeding.location})</span>
      {nextFeeding.note && <span className={styles.note}>[{nextFeeding.note}]</span>}
    </div>
  );
};