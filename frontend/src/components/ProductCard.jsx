const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-xl font-bold text-blue-600 mb-4">${product.price}</p>
      <button
        onClick={() => onAddToCart(product)}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}

export default ProductCard