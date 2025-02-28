import Image from "@/components/Image/Image";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { useNavigate } from "react-router";

interface Props {
  product: Product;
  variant?: "detail" | "checkout";
  onClick?: () => void;
}

export default function ProductCard({
  product,
  variant = "detail",
  onClick,
}: Props) {
  const navigate = useNavigate();
  const pressCard = () => {
    if (variant == "checkout" && onClick) {
      onClick();
    }
  };
  return (
    <div
      onClick={pressCard}
      className={`w-full ${
        variant == "checkout"
          ? "bg-white active:bg-green-400 select-none h-[350px] active:h-[340px]"
          : "bg-white h-[350px]"
      }  rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden hover:transform hover:scale-[1.02] relative`}
    >
      {/* Contenedor de imagen con overlay y badge de precio */}
      <div className="relative h-3/4 w-full overflow-hidden">
        <Image
          title={`Ver Producto ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.photoUrl}
        />

        {/* Overlay de hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge de precio */}
        <span className="absolute top-2 right-2 bg-green-600  text-white px-3 py-1 rounded-full text-xl font-bold backdrop-blur-sm">
          {product.price.toLocaleString()} Gs
        </span>
      </div>

      {/* Contenido inferior */}
      <section className={"p-4 flex flex-col justify-between h-1/4"}>
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Botón flotante en hover */}
        <button
          onClick={() => navigate(`../${product.id}`)}
          className={`${
            variant == "checkout" ? "hidden" : "absolute"
          } inset-0 m-auto w-fit h-fit opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-primary-dark
          flex items-center gap-2 transform hover:scale-105`}
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

      {/* Etiqueta de stock (opcional) */}
      {!product.uncounted && product.stock <= 10 && (
        <span className="absolute top-2 left-2 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs font-medium">
          Últimas {product.stock} unidades
        </span>
      )}
    </div>
  );
}
