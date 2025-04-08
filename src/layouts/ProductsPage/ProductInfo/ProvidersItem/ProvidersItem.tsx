import useProvider from "@/hooks/providers/useProvider"

export default function ProvidersItem({
    providerId
}: {
    providerId: string
}) {
    const {getProviderById} = useProvider(providerId);
    if(getProviderById.isFetching) return null;
  return (
    <>
    {getProviderById.data?.name || "No Encontrado"}
    </>
  )
}
