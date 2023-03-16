import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestSlide = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        <div>
          <img src="https://via.placeholder.com/150" alt="carousel item" />
        </div>
        <div>
          <img src="https://via.placeholder.com/150" alt="carousel item" />
        </div>
        <div>
          <img src="https://via.placeholder.com/150" alt="carousel item" />
        </div>
        <div>
          <img src="https://via.placeholder.com/150" alt="carousel item" />
        </div>
        <div>
          <img src="https://via.placeholder.com/150" alt="carousel item" />
        </div>
      </Slider>
    </div>
  );
};

export default TestSlide;
