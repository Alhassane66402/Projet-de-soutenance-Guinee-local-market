export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-green-600 font-bold">{product.price.toLocaleString()} GNF</p>
        <button className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
