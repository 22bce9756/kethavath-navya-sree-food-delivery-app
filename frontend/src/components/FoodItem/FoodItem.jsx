import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, currency } = useContext(StoreContext);

    // Get quantity from cart or default to 0
    const quantity = cartItems?.[id] || 0;

    // Backend base URL from .env
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    // Compute the final image URL
    const imageUrl = image?.startsWith('http')
        ? image // Already a full URL (e.g., Cloudinary)
        : `${apiBaseUrl}/images/${image}`; // Local backend image

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img
                    className='food-item-image'
                    src={imageUrl}
                    alt={name}
                />

                {quantity === 0 ? (
                    <img
                        className='add'
                        onClick={() => addToCart(id)}
                        src={assets.add_icon_white}
                        alt='Add to cart'
                    />
                ) : (
                    <div className='food-item-counter'>
                        <img
                            src={assets.remove_icon_red}
                            onClick={() => removeFromCart(id)}
                            alt='Remove from cart'
                        />
                        <p>{quantity}</p>
                        <img
                            src={assets.add_icon_green}
                            onClick={() => addToCart(id)}
                            alt='Add more'
                        />
                    </div>
                )}
            </div>

            <div className='food-item-info'>
                <div className='food-item-name-rating'>
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt='Rating stars' />
                </div>
                <p className='food-item-desc'>{desc}</p>
                <p className='food-item-price'>
                    {currency}{price}
                </p>
            </div>
        </div>
    );
};

export default FoodItem;
