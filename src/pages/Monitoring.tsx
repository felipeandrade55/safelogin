import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ZabbixAPI } from "@/services/zabbixApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Monitoring() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: zabbixServers } = useQuery({
    queryKey: ['zabbix-servers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zabbix_servers')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: monitoredDevices, refetch: refetchDevices } = useQuery({
    queryKey: ['monitored-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monitored_devices')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  const syncZabbixData = async () => {
    if (!zabbixServers?.length) {
      toast.error("Nenhum servidor Zabbix configurado");
      return;
    }

    setIsLoading(true);
    try {
      for (const server of zabbixServers) {
        const api = new ZabbixAPI(server.url);
        await api.login(server.username, server.password);
        const hosts = await api.getHosts();

        // Update monitored devices
        for (const host of hosts) {
          const { error } = await supabase
            .from('monitored_devices')
            .upsert({
              zabbix_server_id: server.id,
              host_id: host.hostid,
              name: host.name,
              status: host.status === '0' ? 'enabled' : 'disabled',
              last_check: new Date().toISOString(),
            }, {
              onConflict: 'zabbix_server_id,host_id',
            });

          if (error) {
            console.error('Error updating device:', error);
          }
        }
      }

      await refetchDevices();
      toast.success("Dados sincronizados com sucesso!");
    } catch (error) {
      console.error('Error syncing data:', error);
      toast.error("Erro ao sincronizar dados");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Monitoramento</h1>
        <Button onClick={syncZabbixData} disabled={isLoading}>
          {isLoading ? "Sincronizando..." : "Sincronizar Dados"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Servidores Zabbix</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Última Sincronização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zabbixServers?.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell>{server.name}</TableCell>
                    <TableCell>{server.url}</TableCell>
                    <TableCell>
                      {server.last_sync ? new Date(server.last_sync).toLocaleString() : 'Nunca'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispositivos Monitorados</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Verificação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monitoredDevices?.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'enabled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status === 'enabled' ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {device.last_check ? new Date(device.last_check).toLocaleString() : 'Nunca'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}