export class ApiError extends Error {
  constructor(res) {
    super(`${res.success}`)
  }
}
