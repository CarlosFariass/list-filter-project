export interface ListType {
    userId: number
    id: number
    title: string
    body: string
    completed: boolean
  }

  // service
  export type TaskService = {
    userId?: number
    title: string
    body: string
  }

  export type NewTask = Omit<ListType, "id" | "completed">;
