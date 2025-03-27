import ProductsForm from "@/components/forms/products-form";

export default function NewProduct() {
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 flex items-start justify-center mt-6 md:mt-4">
      <ProductsForm className="w-full max-w-4xl" />
    </div>
  );
}