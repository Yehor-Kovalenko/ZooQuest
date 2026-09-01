import { useEffect, useState } from "react";
import styles from './HeaderContainer.module.css'
import logo from '@/assets/Adobe Express - file.png';
import { FeedingBanner } from './panels/FeedingBanner';
import { useTranslation } from "react-i18next";

type WarsawTime = {
  h: number;
  m: number;
  s: number;
};

type ZooStatus = {
  text: string;
  className: string;
};


function getWarsawTime(date: Date): WarsawTime {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    h: get("hour"),
    m: get("minute"),
    s: get("second"),
  };
}

function getZooStatus(h: number, m: number, t: any): ZooStatus {
  const mins = h * 60 + m;

  if (mins < 9 * 60) {
    return {
      text: t("header.opensAt", { time: "9:00" }),
      className: `${styles.pill} ${styles.pillClosed}`,
    };
  }

  if (mins < 18 * 60 + 45) {
    return {
      text: t("header.open", { time: "18:45" }),
      className: `${styles.pill} ${styles.pillOpen}`,
    };
  }

  if (mins < 19 * 60) {
    return {
      text: t("header.groundsClosing"),
      className: `${styles.pill} ${styles.pillAmber}`,
    };
  }

  return {
    text: t("header.closed", { time: "9:00" }),
    className: `${styles.pill} ${styles.pillClosed}`,
  };
}

const HeaderContainer = () => {
  const [now, setNow] = useState(() => new Date());
  const { i18n, t } = useTranslation();


  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const { h, m, s } = getWarsawTime(now);

  const pad = (value: number) => String(value).padStart(2, "0");

  const clock = `${pad(h)}:${pad(m)}:${pad(s)}`;


  const status = getZooStatus(h, m, t);

  return (
    <>
      <header>
        <div className={styles.brandRow}>
      <img src={logo} alt="Zoo Łódź Logo" className={styles.brandLogo} />
      <div className={styles.Brand}>
          </div>

          <div className={styles.clockWrap}>
            <div className={styles.clock}>
              {clock}
            </div>

          </div>
        </div>

        <span className={status.className}>
          {status.text}
        </span>
      {/* Feeding Notification Banner */}
      <FeedingBanner />
      <div className={styles.perf}></div>
      <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="pl">Polski</option>
    </select>
    </header>
    </>
  );
};

export default HeaderContainer;