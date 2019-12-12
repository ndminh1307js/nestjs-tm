import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository
  ) {}

  //get all tasks
  async getTasks(): Promise<Task[]> {
    const tasks = await this.taskRepository.find();
    return tasks;
  }

  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }
    return task;
  }

  async addTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }
}
