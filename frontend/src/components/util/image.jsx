import Carousel from 'react-bootstrap/Carousel';
import photo from '../../images/cover_Products-to-sell-online-min.png';
import photoo from '../../images/How-to-Sell-Digital-Products.webp';
import photooo from '../../images/products-to-sell-from-home-1-1.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/home.css';
export default function Immage() {
  return (
<Carousel class=" carousel-control-color carousel-indicator-transition:opacity .6s ease  carousel-control-transition:opacity .15s ease carousel-transition-duration:       .6s">
      <Carousel.Item>
        <img className="d-block w-70 carousel-img carousel-img-centered" src={photo} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-70 carousel-img carousel-img-centered" src={photooo} alt="Second slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-70 carousel-img carousel-img-centered"  src={photoo} alt="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}
