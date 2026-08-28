import styles from "./FooterContainer.module.css"
import type { FooterTab } from "../App";

type FooterContainerProps = {
  activeTab: FooterTab;
  onTabChange: (tab: FooterTab) => void;
};

const FooterContainer = ({
  activeTab,
  onTabChange,
}: FooterContainerProps) => {

  const tabs: { id: FooterTab; [key: string]: any }[] = [
    { id: "map", label: "Map", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M14.6 9.4 10 10.4 9 15l4.6-1L14.6 9.4Z"/></svg>) },
    { id: "food", label: "Food", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2v8M9.2 2v6a2.2 2.2 0 0 1-2.2 2.2 2.2 2.2 0 0 1-2.2-2.2V2M8 12.2V22M16 2c-1.3 0-2.4 1.8-2.4 5s1.1 5 2.4 5V22"/></svg>) },
    { id: "news", label: "News", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h13a2 2 0 0 1 2 2v11.2a1 1 0 0 1-1.5.86L16 18H5a1 1 0 0 1-1-1V5Z"/><path d="M8 9h7M8 12h7M8 15h4"/></svg>) },
  ];

  return (
    <nav className={styles.tabbar}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.navbtn} ${
            activeTab === tab.id ? styles.active : ""
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab?.icon}
          {tab.label ?? ""}
        </button>
      ))}
    </nav>
  );
};

export default FooterContainer; 