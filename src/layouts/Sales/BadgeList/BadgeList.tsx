import useProductsByIds from "@/hooks/products/useProductsByIds";
import { Product } from "@/infrastructure/interfaces/sale/sale.interface";
import { motion } from "framer-motion";
import SaleProductBadge from "./SaleProductBadge";
import { cn } from "@/lib/utils";
export default function BadgeList({ products }: { products: Product[] }) {
  const idArr = products.map((product) => product.product);
  const { getProductsByIds } = useProductsByIds(idArr);
  if (getProductsByIds.isFetching) {
    return null;
  }
  return (
    <>
      {products.map((product, index) => {
        return (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "p-4 rounded-xl border-2",
              product.cancelled
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            )}
          >
            <SaleProductBadge
              name={getProductsByIds.data?.find((p) => p.id == product.product)?.name || "Unknown Product"}
              product={product} />
          </motion.div>
        );
      })}
    </>
  );
}
