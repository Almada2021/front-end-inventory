import Image from "@/components/Image/Image";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { useNavigate } from "react-router";
interface Props {
  product: Product;
  variant?: "detail" | "virtual";
  onClick?: () => void;
}

export default function ProductCard({
  product,
  variant = "detail",
  onClick,
}: Props) {
  const navigate = useNavigate();
  const pressCard = () => {
    if (variant === "virtual" && onClick) {
      onClick();
    }
  };

  if (variant === "virtual") {
    return (
      <div
        onClick={pressCard}
        className="w-full select-none bg-white h-[350px]  rounded-xl shadow-md cursor-pointer relative active:bg-green-500 hover:bg-slate-100"
      >
        <div className="relative h-3/4 w-full overflow-hidden">
          <Image
            title={`Ver Producto ${product.name}`}
            className="h-full w-full object-cover select-none"
            src={product.photoUrl}
          />

          <span className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xl font-bold select-none">
            {formatCurrency(product.price)}
          </span>
        </div>

        <section className="p-4 flex flex-col justify-between h-1/4">
          <h3 className="text-lg font-semibold text-gray-800 truncate line-clamp-2 leading-tight select-none">
            {product.name.length > 40
              ? `${product.name.substring(0, 40)}...`
              : product.name}
          </h3>
        </section>

        {!product.uncounted && product.stock <= 10 && (
          <span className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium select-none">
            Últimas {product.stock} unidades
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={pressCard}
      className="w-full bg-white h-[350px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden hover:transform hover:scale-[1.02] relative"
    >
      <div className="relative h-3/4 w-full overflow-hidden">
        <Image
          title={`Ver Producto ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.photoUrl}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <span className="absolute top-2 right-2 bg-green-600  text-white px-3 py-1 rounded-full text-xl font-bold backdrop-blur-sm">
          {product.price.toLocaleString()} Gs
        </span>
      </div>

      <section className="p-4 flex flex-col justify-between h-1/4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        <button
          onClick={() => navigate(`../${product.id}`)}
          className="absolute inset-0 m-auto w-fit h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-dark
          flex items-center gap-2 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Ver Detalles
        </button>
      </section>

      {!product.uncounted && product.stock <= 10 && (
        <span className="hidden md:block md:absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
          Últimas {product.stock} unidades
        </span>
      )}
      {!product.uncounted && product.stock <= 10 && (
        <span className="block absolute md:hidden top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xl font-medium">
          {product.stock}
        </span>
      )}
    </div>
  );
}
