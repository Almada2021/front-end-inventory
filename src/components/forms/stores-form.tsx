import MainForm from "./Main/MainForm";
import { FormikHelpers, FormikValues } from "formik";
import { BackendApi } from "@/core/api/api";
import { StoreCreationResponse } from "@/infrastructure/interfaces/store/store.interface";
import * as Yup from "yup";

interface FormFields extends FormikValues {
  name: string;
  address?: string; // Ensure this is a string
}
export default function StoresForm() {
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
    if (storeCreation.data.err) {
      console.log("Err");
    } else if (storeCreation.data.store) {
      console.log(storeCreation);
      console.log("Hello", values.name);
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
