import { createContext, useEffect, useState } from "react";
import { food_list as foodListStatic, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://kethavath-navya-sree-food-delivery-app.onrender.com";
    const IMG_BASE = import.meta.env.VITE_IMG_BASE || API_BASE;

    axios.defaults.withCredentials = true; // ✅ send cookies automatically

    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const currency = "$";
    const deliveryCharge = 25;

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        await axios.post(`${API_BASE}/api/cart/add`, { itemId });
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
        await axios.post(`${API_BASE}/api/cart/remove`, { itemId });
    };

    const fetchFoodList = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/food/list`);
            setFoodList(res.data.data);
        } catch {
            setFoodList(foodListStatic);
        }
    };

    const loadCartData = async () => {
        const res = await axios.post(`${API_BASE}/api/cart/get`);
        setCartItems(res.data.cartData || {});
    };

    useEffect(() => {
        fetchFoodList();
        loadCartData();
    }, []);

    const contextValue = {
        API_BASE,
        IMG_BASE,
        food_list: foodList,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
