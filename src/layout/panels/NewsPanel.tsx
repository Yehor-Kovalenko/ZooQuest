const NewsPanel = () => {
  const NEWS = [
    {id: 1, date:'29 Apr 2026', title:"Poland's largest walk-through butterfly house opens inside the Orientarium.", url:'https://orientarium.lodz.pl/en/polands-largest-butterfly-house-is-now-open-only-at-the-lodz-zoo-orientarium/'},
    {id: 2, date:'29 Apr 2026', title:'A Sumatran orangutan is born at the Orientarium — a rare breeding success for Poland.', url:'https://orientarium.lodz.pl/en/a-huge-success-in-poland-a-sumatran-orangutan-was-born-at-the-lodz-zoos-orientarium/'},
    {id: 3, date:'10 Apr 2026', title:"Coral seized in Poland's largest wildlife-smuggling case is brought to the zoo for care.", url:'https://orientarium.lodz.pl/en/precious-corals-rescued-animals-from-the-largest-smuggling-attempt-in-polands-history-brought-to-orientarium-zoo-lod/'},
    {id: 4, date:'3 Oct 2025', title:'A design competition opens for the next major project, the "Elemental Pavilion."', url:'https://orientarium.lodz.pl/en/the-elemental-pavilion-new-main-attraction-of-orientarium-zoo-lodz/'},
    {id: 5, date:'9 Sep 2025', title:'The "Elemental Pavilion" is announced as the Orientarium\'s next big attraction.', url:'https://orientarium.lodz.pl/en/elemental-pavilion-main-attraction-of-the-new-zoo-in-lodz/'}
  ];

  return (
    <div id="news-panel">
      <p className="news-note">Dispatches from the zoo — snapshot from the official newsroom, tap through for the latest.</p>
      <div id="news-list">
        { NEWS.map(n=> (
          <div className="news-card" key={n.id} >
            <div className="news-date">${n.date}</div>
            <p>${n.title}</p>
            <a href="${n.url}" target="_blank" rel="noopener">Read more →</a>
          </div> )
        ) }
      </div>
      <p className="footlinks"><a href="https://orientarium.lodz.pl/en/news/" target="_blank" rel="noopener">See all news at orientarium.lodz.pl →</a></p>
    </div>
  )
};

export default NewsPanel;