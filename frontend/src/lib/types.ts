export interface Task {
  id: string;
  desc: string;
  status: string;
  level: number;
  task_type: string;
  plan?: string;
  agent?: string;
  [key: string]: any;
}

export interface Agent {
  name: string;
  status: 'active' | 'idle' | 'offline';
  pid?: number | null;
}

export interface SystemHealth {
  can_accept_tasks: boolean;
  models_alive?: number;
  vram_free_mb?: number;
}
