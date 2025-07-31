import React from 'react';
import Slider from 'react-slick';
import './ReviewCarousel.css';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa';

const ReviewCarousel = () => {
    const reviews = [
        { text: "CleanData helped me remove sensitive data from over 100 sites!", author: "John D.", rating: 5 },
        { text: "An excellent service that ensures my privacy is protected.", author: "Jane S.", rating: 4 },
        { text: "Super easy to use and extremely effective.", author: "Mark W.", rating: 5 },
        { text: "Finally found a solution to remove unwanted personal information!", author: "Alex P.", rating: 5 },
    ];

    // Custom arrow functions to control slick slider arrows
    const PrevArrow = ({ onClick }) => (
        <button
            className="custom-arrow custom-prev"
            onClick={onClick}
        >
            <FaChevronLeft />
        </button>
    );

    const NextArrow = ({ onClick }) => (
        <button
            className="custom-arrow custom-next"
            onClick={onClick}
        >
            <FaChevronRight />
        </button>
    );

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        prevArrow: <PrevArrow />,  // Use custom arrow components
        nextArrow: <NextArrow />,
    };

    const renderStars = (rating) => {
        const filledStars = Array.from({ length: rating }, (_, i) => (
            <FaStar key={i} className="star-icon" />
        ));
        return <div className="stars">{filledStars}</div>;
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                        <p className="review-text">"{review.text}"</p>
                        <p className="review-author">- {review.author}</p>
                        {renderStars(review.rating)}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ReviewCarousel;
