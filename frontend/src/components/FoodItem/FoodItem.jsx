import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart, url, currency } = useContext(StoreContext);

    // Handle the case where cartItems might be undefined
    const quantity = cartItems?.[id] || 0;

    return (
        <div className='food-item'>
            <div className='food-item-img-container'>
                <img
                    className='food-item-image'
                    src={`${url}/images/${image}`}
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
                <p className='food-item-price'>{currency}{price}</p>
            </div>
        </div>
    );
};

export default FoodItem;
