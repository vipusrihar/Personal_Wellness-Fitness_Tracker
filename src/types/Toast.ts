export interface Toast {
  id: number;
  message: string;
  type: "info" | "success" | "warning" | "achievement";
}