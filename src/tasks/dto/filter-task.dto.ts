import { TaskStatus } from '../task-status.enum';

export class FilterTaskDTO {
  status: TaskStatus;
  search: string;
}
