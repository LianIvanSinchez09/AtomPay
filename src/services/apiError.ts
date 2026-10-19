/** Saca el mensaje del backend de un error de axios, si está. */
export function errorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { data?: { message?: string } } })
      .response;
    if (response?.data?.message) return response.data.message;
  }

  return error instanceof Error ? error.message : "Error inesperado";
}
