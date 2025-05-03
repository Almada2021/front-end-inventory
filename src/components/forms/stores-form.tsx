import MainForm from "./Main/MainForm";
import { FormikHelpers, FormikValues } from "formik";
import { BackendApi } from "@/core/api/api";
import { StoreCreationResponse } from "@/infrastructure/interfaces/store/store.interface";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface FormFields extends FormikValues {
  name: string;
  address?: string; // Ensure this is a string
}
export default function StoresForm() {
  const navigate = useNavigate();
  const onSubmit = async (
    values: FormFields,
    formikHelpers: FormikHelpers<FormFields>
  ) => {
    const storeCreation = await BackendApi.post<StoreCreationResponse>(
      "/stores/create",
      {
        ...values,
      }
    );
    toast.success("Creando tienda...");
    if (storeCreation.data.err) {
      toast.error(storeCreation.data.err);
    } else if (storeCreation.data) {
      toast.success(`Tienda creada correctamente ${values.name}`);
      navigate(`/inventory/stores/show/${storeCreation.data.store?.id}`);
    }
    formikHelpers.resetForm();
  };
  return (
    <MainForm<FormFields>
      debug={false}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("Nombre Es Requerido"),
        address: Yup.string().optional(),
      })}
      fields={[
        {
          name: "name",
          label: "Nombre de la tienda",
          required: true,
          type: "text",
        },
        {
          name: "address",
          label: "Direccion de la tienda",
          type: "text",
        },
      ]}
      initialValues={{
        name: "",
        address: "",
      }}
      title="Agregar Tienda"
      sentText="Crear Tienda"
      onSubmit={onSubmit}
    />
  );
}
