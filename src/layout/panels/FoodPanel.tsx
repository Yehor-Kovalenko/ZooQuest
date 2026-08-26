const FoodPanel = () => {

  const FOOD = [
  {id: 1, name:'Pora Karmienia', tag:'Mains · self-service', desc:"The food court's main restaurant — self-service, Asian-leaning menu, themed hall seating 200+."},
  {id: 2, name:'Pizzeria Lovers by The Chef', tag:'Wood-fired pizza', desc:'Fresh pizza from the oven, industrial-styled counter.'},
  {id: 3, name:'Panda Sandwich', tag:'Panini · zapiekanki · bao', desc:"Panini, classic zapiekanki, burgers and bao buns, plus a kids' menu and desserts."},
  {id: 4, name:'House of Sushi', tag:'Sushi · ramen', desc:'Japanese kitchen with classic sushi and an award-winning ramen, in beef, seafood and veg versions.'},
  {id: 5, name:'BM Ice Blue Cafe', tag:'Coffee · ice cream', desc:'Coffee, ice cream, bubble waffles and pancakes, with a few orientarium-inspired flavours.'},
  {id: 6, name:'Bubble tea stand', tag:'Bubble tea', desc:'Taiwanese milk tea, hot or cold — classic, milk, sorbet or shake style.'},
  {id: 7, name:'Coffee island & ice-cream carts', tag:'Grab & go', desc:'Smaller kiosks scattered through the hall for a quick coffee or scoop.'}
];

  return (
    <div id="food-panel">
      <div className="food-head"><strong>Food Court</strong> — inside the Orientarium building, right by the entrance, next to Mini ZOO and the playground. A coffee island and ice-cream carts are dotted through the same hall.</div>
      <div id="food-list">
        { FOOD.map( f => (
        <div className="food-card" key={f.id}>
          <span className="tag">${f.tag}</span>
          <h3>${f.name}</h3>
          <p>${f.desc}</p>
        </div>)
        )}
      </div>
      <p className="trivia">None of the food court's kitchens use palm oil.</p>
    </div>
  )
};

export default FoodPanel;