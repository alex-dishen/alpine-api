export type ColumnValueWithOptionRow = {
  id: string;
  job_id: string;
  column_id: string;
  option_id: string | null;
  value: string | null;
  created_at: Date;
  updated_at: Date;
  // Left joined option fields (nullable)
  option_id_nested: string | null;
  option_column_id: string | null;
  option_label: string | null;
  option_color: string | null;
  option_position: number | null;
  option_created_at: Date | null;
  option_updated_at: Date | null;
};
