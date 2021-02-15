import { BASE_URL } from '../infra/constants'
import { KEY_TOKEN } from '../infra/storage'

export interface NetworkMessage<T> {
  status: number
  data: T
  message?: string
}

export class BaseApi {
  token: string | null = null

  get commonHeaders() {
    if (!this.token)
      this.token = localStorage.getItem(KEY_TOKEN)
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.token || ''
    }
  }

  protected async get<T>(path: string): Promise<NetworkMessage<T>> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: this.commonHeaders,
    })
    return await res.json()
  }

  protected async post<T>(path: string, body?: object): Promise<NetworkMessage<T>> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: this.commonHeaders,
      body: JSON.stringify(body)
    })
    return await res.json()
  }
}