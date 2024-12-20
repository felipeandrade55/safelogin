import { supabase } from "@/lib/supabase";

interface ZabbixAuthResponse {
  result: string;
}

interface ZabbixHost {
  hostid: string;
  host: string;
  name: string;
  status: string;
  available: string;
}

interface ZabbixHostsResponse {
  result: ZabbixHost[];
}

export class ZabbixAPI {
  private url: string;
  private auth: string | null = null;

  constructor(url: string) {
    this.url = url;
  }

  private async makeRequest(method: string, params: any = {}) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params: {
          ...params,
          ...(this.auth ? { auth: this.auth } : {}),
        },
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async login(username: string, password: string) {
    const response = await this.makeRequest('user.login', {
      user: username,
      password: password,
    }) as ZabbixAuthResponse;

    this.auth = response.result;
    return this.auth;
  }

  async getHosts() {
    if (!this.auth) {
      throw new Error('Not authenticated');
    }

    const response = await this.makeRequest('host.get', {
      output: ['hostid', 'host', 'name', 'status', 'available'],
    }) as ZabbixHostsResponse;

    return response.result;
  }
}