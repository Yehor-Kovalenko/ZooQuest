import { useEffect, useState } from "react";
import styles from './HeaderContainer.module.css'
import logo from '@/assets/Adobe Express - file.png';

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

function getZooStatus(h: number, m: number): ZooStatus {
  const mins = h * 60 + m;

  if (mins < 9 * 60) {
    return {
      text: "Opens at 9:00",
      className: "pill pill-closed",
    };
  }

  if (mins < 18 * 60 + 45) {
    return {
      text: "Open · pavilions close 18:45",
      className: "pill pill-open",
    };
  }

  if (mins < 19 * 60) {
    return {
      text: "Grounds closing now",
      className: "pill pill-amber",
    };
  }

  return {
    text: "Closed · opens 9:00 tomorrow",
    className: "pill pill-closed",
  };
}

const HeaderContainer = () => {
  const [now, setNow] = useState(() => new Date());

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


  const status = getZooStatus(h, m);

  return (
    <>
      <header>
        <div className={styles.brandRow}>
      <img src={logo} alt="Zoo Łódź Logo" className={styles.brandLogo} />
      <div className="brand">
          </div>

          <div className="clock-wrap">
            <div className="clock">
              {clock}
            </div>

          </div>
        </div>

        <span className={status.className}>
          {status.text}
        </span>
      </header>

      <div className="perf"></div>
    </>
  );
};

export default HeaderContainer;