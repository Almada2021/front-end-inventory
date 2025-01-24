import { ProviderModel } from "../interfaces/provider.interface";

export class ProviderMapper {
  static fromBackToFront = (provider: ProviderModel): ProviderModel => {
    return provider;
  };
}
