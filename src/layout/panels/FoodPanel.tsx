import React from 'react';
import styles from './FoodPanel.module.css';

// Replace these with your actual image paths
import poraKarmieniaImg from '@/assets/pora-karmienia.jpg';
import loversImg from '@/assets/lovers.jpg';
import iceBlueImg from '@/assets/ice-blue.jpg';
import crazyBubbleImg from '@/assets/crazy-bubble.jpg';
import hapsImg from '@/assets/haps.jpg';
import tlustySledzImg from '@/assets/tlusty-sledz.jpg';
import zyrafkaImg from '@/assets/zyrafka.jpg';
import zapiekanariumImg from '@/assets/zapiekanarium.jpg';
import sweetShopImg from '@/assets/sweet-shop.jpg';
import koziWierchImg from '@/assets/kozi-wierch.jpg';
import safariBistroImg from '@/assets/safari-bistro.jpg';
import kebabHouseImg from '@/assets/kebab-house.jpg';
import theChefImg from '@/assets/thechef.jpg' 


interface FoodItem {
  id: number;
  name: string;
  tag: string;
  desc: string;
  image: string;
}

const FOOD: FoodItem[] = [
  {
    id: 1,
    name: 'Pora Karmienia',
    tag: 'Dania główne · Samoobsługa',
    desc: 'Restauracja główna z różnorodnym menu, daniami kuchni polskiej i azjatyckiej. Pomieści ponad 170 osób.',
    image: poraKarmieniaImg,
  },
  {
    id: 2,
    name: 'Pizzeria Lovers by The Chef',
    tag: 'Pizza z pieca',
    desc: 'Świeża pizza prosto z pieca serwowana w przytulnym, industrialnym wnętrzu.',
    image: loversImg,
  },
  {
    id: 3,
    name: 'Ice Blue Cafe',
    tag: 'Kawa · Lody · Gofry',
    desc: 'Aromatyczna kawa, aksamitne lody, bąbelkowe gofry, naleśniki oraz orzeźwiające lemoniady.',
    image: iceBlueImg,
  },
  {
    id: 4,
    name: 'Crazy Bubble',
    tag: 'Bubble Tea',
    desc: 'Oryginalny tajwański napój na bazie zielonej lub czarnej herbaty w wielu wariantach smakowych.',
    image: crazyBubbleImg,
  },
  {
    id: 5,
    name: 'Naleśnikarnia HAPS',
    tag: 'Naleśniki · Placki',
    desc: 'Naleśniki na słodko i wytrawnie (mięsne/wege), pancakes oraz domowe placki ziemniaczane.',
    image: hapsImg,
  },
  {
    id: 6,
    name: 'Tłusty Śledź',
    tag: 'Ryby · Burgery rybne',
    desc: 'Smażone ryby prosto z polskiego wybrzeża, burgery rybne, zupa rybna oraz rybne kanapki.',
    image: tlustySledzImg,
  },
  {
    id: 7,
    name: 'Kawka Żyrafka',
    tag: 'Kawa na wynos · Lody naturalne',
    desc: 'Prawdziwie naturalne lody, kawa na wynos, słodkie desery i domowe ciasta dla całej rodziny.',
    image: zyrafkaImg,
  },
  {
    id: 8,
    name: 'Zapiekanarium',
    tag: 'Zapiekanki · Frytki',
    desc: 'Klasyczne i egzotyczne zapiekanki, frytki oraz chłodzące napoje na szybką przekąskę.',
    image: zapiekanariumImg,
  },
  {
    id: 9,
    name: 'Sweet Shop',
    tag: 'Słodycze z całego świata',
    desc: 'Sklep pełen żelek, cukierków, ręcznie robionych lizaków, pianek oraz opcji wegańskich/bezglutenowych.',
    image: sweetShopImg,
  },
  {
    id: 10,
    name: 'Kozi Wierch',
    tag: 'Grill · Śniadania · Oscypki',
    desc: 'Dania z grilla węglowego, ciepłe oscypki z żurawiną, bar sałatkowy i chleb ze smalcem.',
    image: koziWierchImg,
  },
  {
    id: 11,
    name: 'Safari Bistro',
    tag: 'Hot Dogi · Frytki · przekąski',
    desc: 'Szybkie przekąski, złociste frytki, hot dogi i lody zlokalizowane tuż obok wybiegu dla żyraf.',
    image: safariBistroImg,
  },
  {
    id: 12,
    name: 'Kebab House & The Chef',
    tag: 'Kebab · Burgery · Falafel',
    desc: 'Kraftowe mięsa wołowe i z kurczaka, soczyste burgery wołowe i świeży falafel ze wspólnym ogródkiem.',
    image: kebabHouseImg,
  },
  {
    id: 13,
    name: 'The Chef',
    tag: 'Burgery · Falafel · Frytki',
    desc: 'Lokal serwujący pyszne burgery wołowe, chrupiący falafel oraz frytki.',
    image: theChefImg,
  },
];

const FoodPanel: React.FC = () => {
  return (
    <div className={styles.foodPanel}>
      <div className={styles.foodHead}>
        <strong>Strefa Gastronomiczna</strong> — bogata oferta ponad 10 lokali znajdujących się w budynku Orientarium oraz na terenie ZOO.
      </div>
      <div className={styles.foodList}>
        {FOOD.map((f) => (
          <div className={styles.foodCard} key={f.id}>
            <img src={f.image} alt={f.name} className={styles.cardImage} />
            <div className={styles.cardContent}>
              <span className={styles.tag}>{f.tag}</span>
              <h3>{f.name}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <p className={styles.trivia}>Wszystkie punkty gastronomiczne na terenie Orientarium nie używają oleju palmowego.</p>
    </div>
  );
};

export default FoodPanel;