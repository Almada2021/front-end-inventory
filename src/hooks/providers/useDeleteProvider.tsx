import {
  deleteProviderAction,
  DeleteProviderResponse,
} from "@/core/actions/providers/deleteProvider.action";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export default function useDeleteProvider(): UseMutationResult<DeleteProviderResponse> {
  return useMutation((id: string) => deleteProviderAction(id));
}
