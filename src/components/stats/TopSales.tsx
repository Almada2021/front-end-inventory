import useTopSelling from "@/hooks/stats/useTopSelling";
import { formatCurrency } from "@/lib/formatCurrency.utils";
import { Trophy, Gem, Medal, Award, Star } from "lucide-react";
import { Link } from "react-router";
import Image from "../Image/Image";
import { Skeleton } from "../ui/skeleton";

const rankIcons = [
  <Trophy className="w-5 h-5 text-amber-400" />,
  <Gem className="w-5 h-5 text-blue-400" />,
  <Medal className="w-5 h-5 text-rose-400" />,
  <Award className="w-5 h-5 text-emerald-400" />,
  <Star className="w-5 h-5 text-purple-400" />,
];

export default function TopSales() {
  const { topSellingQuery } = useTopSelling();

  if (topSellingQuery.isFetching) {
    return <Skeleton className="h-10 w-full md:w-1/2 " />;
  }
  const topProducts = topSellingQuery.data?.slice(0, 5) || [];

  return (
    <div className="w-full md:w-1/2 p-4">
      <h3 className="text-lg font-semibold mb-4">Productos más vendidos</h3>
      <div className="space-y-4">
        {topProducts.map((item, index) => {
          return (
            <div
              key={item._id}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0 w-8 mr-3">
                {rankIcons[index] || <Star className="w-5 h-5 text-gray-400" />}
              </div>
              <Image
                src={item.product.photoUrl || "/placeholder-product.jpg"}
                alt={item.product.name}
                className="w-12 h-12 rounded-md object-cover mr-4"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/inventory/products/${item.product._id}`}
                  className="font-medium truncate hover:text-blue-600"
                >
                  {item.product.name.substring(0, 16)}
                </Link>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {formatCurrency(item.product.price)} x{" "}
                    {item.salesStats.daily.quantity} ={" "}
                    {formatCurrency(
                      item.product.price * item.salesStats.daily.quantity
                    )}
                  </span>
                  <span>{item.salesStats.daily.quantity} vendidos</span>
                </div>
              </div>
            </div>
          );
        })}
        {topProducts.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No hay datos de ventas disponibles
          </div>
        )}
      </div>
    </div>
  );
}
