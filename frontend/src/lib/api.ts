export class API {
  private static get baseUrl() {
    // Determine the API base URL dynamically or from env
    if (typeof window !== 'undefined') {
      const savedURL = localStorage.getItem('mc_api_url');
      if (savedURL) return savedURL;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private static get headers() {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('mc_token') || '';
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static async get(path: string) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: this.headers,
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${await res.text()}`);
    return res.json();
  }

  static async post(path: string, data: any) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${await res.text()}`);
    return res.json();
  }

  static async put(path: string, data: any) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${await res.text()}`);
    return res.json();
  }

  static getWsUrl() {
    const httpUrl = this.baseUrl;
    const wsUrl = httpUrl.startsWith('https') ? httpUrl.replace('https', 'wss') : httpUrl.replace('http', 'ws');
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('mc_token') || '';
    }
    return `${wsUrl}/ws?token=${token}`;
  }
}
