/** Error con un mensaje que SÍ es seguro mostrar al usuario del admin. */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
