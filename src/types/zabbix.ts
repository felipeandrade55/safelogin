export interface ZabbixServer {
  id: string;
  name: string;
  url: string;
  username: string;
  password: string;
  company_id: string | null;
  created_at: string;
  last_sync: string | null;
}

export interface MonitoredDevice {
  id: string;
  zabbix_server_id: string;
  host_id: string;
  name: string;
  status: 'enabled' | 'disabled';
  last_check: string | null;
  created_at: string;
}