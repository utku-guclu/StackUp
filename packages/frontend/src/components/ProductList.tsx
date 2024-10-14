import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, buyProduct } from "../slices/productSlice";
import { RootState, AppDispatch } from "../store";

const ProductList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items); // Make sure items is the right part of your state.

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (!Array.isArray(products)) {
    return <p>Loading...</p>; // Add a loading state or fallback.
  }

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <button onClick={() => dispatch(buyProduct(product.id))}>Buy</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
