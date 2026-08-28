import FoodPanel from './panels/FoodPanel';
import MapPanel from './panels/MapPanel';
import NewsPanel from './panels/NewsPanel';
import type { FooterTab } from '../App';
import './MainContainer.css';

type MainContainerProps = {
  activeTab: FooterTab;
};

const MainContainer = ({ activeTab }: MainContainerProps) => {
  return (
    <main className="main">
      {activeTab === "map" && <MapPanel />}
      {activeTab === "food" && <FoodPanel />}
      {activeTab === "news" && <NewsPanel />}
    </main>
  );
}

export default MainContainer