import { Card, CardFooter } from "@/components/ui/card";
import { PlusCircleIcon, Container } from "lucide-react";
import { useNavigate } from "react-router";
export default function SuppliersPage() {
  const navigate = useNavigate();
  return (
    <div className=" w-full p-20  md:p-20 flex flex-wrap  gap-4 items-center justify-center">
      {/* <SuppliersForm /> */}
      <Card
        onClick={() => {
          navigate("./new");
        }}
        className="w-full lg:w-4/12 h-3/6 flex flex-col items-center justify-center"
      >
        <PlusCircleIcon className="size-10 w-full h-2/6 md:h-3/6  p-2 md:p-30" />
        <CardFooter className="w-full text-center">
          <h3 className="text-xl md:text-2xl w-full font-bold">
            Crear Proveedor
          </h3>
        </CardFooter>
      </Card>
      <Card
        onClick={() => {
          navigate("./show");
        }}
        className="w-full lg:w-4/12 h-3/6 flex flex-col items-center justify-center"
      >
        <Container className="size-10 w-full h-3/6 p-30" />
        <CardFooter className="w-full text-center">
          <h3 className="text-2xl w-full font-bold">Mostras Proveedores</h3>
        </CardFooter>
      </Card>
    </div>
  );
}
