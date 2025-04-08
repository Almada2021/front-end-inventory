import ProvidersItem from "./ProvidersItem";

export default function ProviderList({ ids }: { ids: string[] }) {
  return (
    <>
      {ids.map((id, item) => {
        const isEnd = item === ids.length - 1;
        return (
          <span key={id}>
            <ProvidersItem providerId={id}  />
            {isEnd ? null : ", "}
          </span>
        );
      })}
    </>
  );
}
