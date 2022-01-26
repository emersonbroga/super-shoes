import { useEffect, useState, useRef } from 'react';
import './App.css';

const SCROLL_TYPE_ROW = 'row';
const SCROLL_TYPE_ITEM = 'item';

function App() {
  const [data, setData] = useState([]);
  const [direction, setDirection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollType] = useState(SCROLL_TYPE_ROW);
  const carousel = useRef(null);

  useEffect(() => {
    fetch('http://localhost:3000/static/shoes.json')
      .then((response) => response.json())
      .then((data) => {
        const newData = data.map((item, idx) => ({ ...item, id: idx }));
        setData(newData);
      });
  }, []);

  const getSizes = () => {
    const itemWidth = carousel.current.childNodes[0].offsetWidth + 20;
    const carouselWidth = carousel.current.offsetWidth;
    const visibleItems = scrollType === SCROLL_TYPE_ITEM ? 1 : Math.floor(carouselWidth / itemWidth);
    const scrollLength = scrollType === SCROLL_TYPE_ITEM ? itemWidth : itemWidth * visibleItems;
    return { itemWidth, carouselWidth, visibleItems, scrollLength };
  };

  const prepend = () => {
    const { visibleItems } = getSizes();
    const lasts = [...data].slice(-1 * visibleItems);
    const firsts = [...data].slice(0, -1 * visibleItems);
    setData([...lasts, ...firsts]);
  };

  const append = () => {
    const { visibleItems } = getSizes();
    const firsts = [...data].slice(0, visibleItems);
    const lasts = [...data].slice(visibleItems, data.length);
    setData([...lasts, ...firsts]);
  };

  const handleLeftClick = (e) => {
    e.preventDefault();
    if (isScrolling) return;
    const { scrollLength } = getSizes();
    setDirection(-1);
    prepend();

    carousel.current.style.scrollBehavior = 'initial';
    carousel.current.scrollLeft = scrollLength;
    setTimeout(() => {
      carousel.current.style.scrollBehavior = 'smooth';
      carousel.current.scrollLeft -= scrollLength;
    }, 0);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (isScrolling) return;
    const { scrollLength } = getSizes();
    carousel.current.scrollLeft += scrollLength;
    setDirection(1);
  };

  const handleScroll = (e) => {
    const { scrollLeft } = e.target;
    const { scrollLength } = getSizes();
    setIsScrolling(true);
    if (direction === 1 && scrollLeft === scrollLength) {
      append();
      carousel.current.style.scrollBehavior = 'initial';
      carousel.current.scrollLeft = 0;
      carousel.current.style.scrollBehavior = 'smooth';
    }
    setIsScrolling(!(scrollLeft === 0 || scrollLeft === scrollLength));
  };

  if (!data || !data.length) return null;

  return (
    <div className="container">
      <div className="logo">
        <img src="/static/images/super-shoes.png" alt="Super Shoes Logo" />
      </div>
      <div className="carousel" ref={carousel} onScroll={handleScroll}>
        {data.map((item) => {
          const { id, name, price, oldPrice } = item;
          return (
            <div className={`item ${id}`} key={id}>
              <div className="image">
                <span className="number">{id + 1}</span>
              </div>
              <div className="info">
                <span className="name">
                  {id + 1} - {name}
                </span>
                <span className="oldPrice">U$ {oldPrice}</span>
                <span className="price">U$ {price}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="buttons">
        <button onClick={handleLeftClick}>
          <img src="/static/images/216151_right_chevron_icon.png" alt="Scroll Left" />
        </button>
        <button onClick={handleRightClick}>
          <img src="/static/images/216151_right_chevron_icon.png" alt="Scroll Right" />
        </button>
      </div>
    </div>
  );
}

export default App;
