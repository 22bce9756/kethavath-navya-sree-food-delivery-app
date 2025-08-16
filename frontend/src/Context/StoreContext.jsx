import { createContext, useEffect, useState } from "react";
import { food_list as foodListStatic, menu_list } from "../assets/assets";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const url = "https://kethavath-navya-sree-food-delivery-app.onrender.com";
    const [foodList, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 50;

    const addToCart = async (itemId) => {
        setCartItems((prev) => {
            // Create a new object to avoid direct state mutation
            const newCartItems = { ...prev };
            // Initialize the item count to 0 if it doesn't exist, then increment
            newCartItems[itemId] = (newCartItems[itemId] || 0) + 1;
            return newCartItems;
        });

        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            // Create a new object to avoid direct state mutation
            const newCartItems = { ...prev };
            // Decrement the item count, ensuring it doesn't go below 0
            newCartItems[itemId] = Math.max((newCartItems[itemId] || 0) - 1, 0);
            return newCartItems;
        });

        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = foodList.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
            // Fallback to static list if API fails
            setFoodList(foodListStatic);
        }
    };

    // Corrected loadCartData to accept token string and set headers correctly
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token: token } });
            setCartItems(response.data.cartData);
        } catch (error) {
            console.error("Error loading cart data:", error);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                const savedToken = localStorage.getItem("token");
                setToken(savedToken);
                // Pass the savedToken string directly to the corrected loadCartData function
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
        loadCartData, // Now expects a token string
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
