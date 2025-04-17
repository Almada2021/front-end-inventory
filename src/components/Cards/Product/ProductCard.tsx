import Image from "@/components/Image/Image";
import { Product } from "@/infrastructure/interfaces/products.interface";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

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

  const stockBadgeClasses = cn(
    "absolute left-2 rounded-md font-medium",
    "bg-red-100 text-red-800",
    "md:px-2 md:py-1 md:text-xs",
    "px-1.5 py-0.5 text-sm"
  );

  const priceClasses = cn(
    "absolute right-2 top-2 rounded-full font-bold",
    "bg-green-600/90 backdrop-blur-sm text-white shadow-sm",
    "md:px-3 md:py-1 md:text-lg",
    "px-2 py-0.5 text-base"
  );

  if (variant === "virtual") {
    return (
      <div
        onClick={pressCard}
        className="group relative h-[280px] w-full cursor-pointer select-none overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:bg-green-50 md:h-[320px]"
      >
        <div className="relative h-[65%] w-full overflow-hidden md:h-[70%]">
          <Image
            title={`Ver Producto ${product.name}`}
            className="h-full w-full select-none object-cover"
            src={product.photoUrl}
          />

          <span className={priceClasses}>{formatCurrency(product.price)}</span>
        </div>

        <section className="flex h-[35%] flex-col justify-between p-2 md:h-[30%] md:p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-gray-800 md:text-base">
            {product.name}
          </h3>

          {!product.uncounted && product.stock && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock <= 10 ? "bg-red-500" : "bg-green-500"
                }`}
              ></span>
              Quedan {product.stock} unidades
            </div>
          )}
        </section>

        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    );
  }

  return (
    <div
      onClick={pressCard}
      className="group relative h-[280px] w-full cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-lg md:h-[320px]"
    >
      <div className="relative h-[65%] w-full overflow-hidden md:h-[70%]">
        <Image
          title={`Ver Producto ${product.name}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.photoUrl}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className={priceClasses}>{formatCurrency(product.price)}</span>
      </div>

      <section className="flex h-[35%] flex-col justify-between p-2 md:h-[30%] md:p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-800 md:text-base">
          {product.name}
        </h3>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`../${product.id}`);
          }}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-primary-dark md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
        <span className={stockBadgeClasses}>{product.stock} unid.</span>
      )}
    </div>
  );
}
