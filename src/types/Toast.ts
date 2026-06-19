import type { ReactNode } from 'react'

export interface Toast {
  id: number;
  message: ReactNode;
  type: "info" | "success" | "warning" | "achievement" | "error";
}