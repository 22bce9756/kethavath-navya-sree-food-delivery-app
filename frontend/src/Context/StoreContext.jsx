import { createContext, useEffect, useState } from "react";
import { food_list as foodListStatic, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));

        if (token) {
            try {
                await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: Math.max((prev[itemId] || 0) - 1, 0)
        }));

        if (token) {
            try {
                await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                const itemInfo = foodList.find((product) => product._id === itemId);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`);
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
            setFoodList(foodListStatic); // fallback to static list
        }
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const savedToken = localStorage.getItem("token");
            if (savedToken) {
                setToken(savedToken);
                await loadCartData(savedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        url,
        food_list: foodList,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
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
