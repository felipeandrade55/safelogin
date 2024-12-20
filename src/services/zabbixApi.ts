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
    // Ensure URL ends with /api_jsonrpc.php
    this.url = url.endsWith('/api_jsonrpc.php') ? url : `${url}/api_jsonrpc.php`;
  }

  private async makeRequest(method: string, params: any = {}) {
    console.log(`Making Zabbix API request to ${this.url}`, { method, params });
    
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
      console.error('Zabbix API error:', response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Zabbix API response:', data);

    if (data.error) {
      console.error('Zabbix API error:', data.error);
      throw new Error(data.error.message || 'Unknown Zabbix API error');
    }

    return data;
  }

  async login(username: string, password: string) {
    console.log('Attempting to login to Zabbix API');
    try {
      const response = await this.makeRequest('user.login', {
        user: username,
        password: password,
      }) as ZabbixAuthResponse;

      this.auth = response.result;
      console.log('Successfully logged in to Zabbix API');
      return this.auth;
    } catch (error) {
      console.error('Failed to login to Zabbix API:', error);
      throw error;
    }
  }

  async getHosts() {
    if (!this.auth) {
      throw new Error('Not authenticated with Zabbix API');
    }

    console.log('Fetching hosts from Zabbix API');
    try {
      const response = await this.makeRequest('host.get', {
        output: ['hostid', 'host', 'name', 'status', 'available'],
      }) as ZabbixHostsResponse;

      console.log('Successfully fetched hosts:', response.result);
      return response.result;
    } catch (error) {
      console.error('Failed to fetch hosts:', error);
      throw error;
    }
  }
}