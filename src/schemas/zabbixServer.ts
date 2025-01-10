import * as z from "zod";

export const zabbixServerSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  url: z.string().min(1, "A URL é obrigatória").url("URL inválida"),
  username: z.string().min(1, "O usuário é obrigatório"),
  password: z.string().min(1, "A senha é obrigatória"),
});

export type ZabbixServerFormData = z.infer<typeof zabbixServerSchema>;