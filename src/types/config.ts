/**
 * Config schema types (config.clientes_companias, config.inputs_estrategicos)
 *
 * Field names mirror database column names. Uses fecha_creacion and
 * client_company_id per project conventions.
 */

export interface ClienteCompania {
  id: number;
  nombre: string;
  fecha_creacion: string;
}

export interface InputEstrategico {
  id: number;
  client_company_id: number;
  category: string | null;
  subcategory: string | null;
  descripcion_producto: string | null;
  industria_vertical: string | null;
  icp_entidades: string | null;
  icp_roles_clave: string | null;
  icp_puntos_dolor: string | null;
  exclusiones: string | null;
  enfoque_geografico: string | null;
  casos_uso: string | null;
  fecha_creacion: string;
}
