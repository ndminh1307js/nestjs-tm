import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';

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

  //get filtered tasks by query
  async getFilteredTasks(filterTaskDTO: FilterTaskDTO): Promise<Task[]> {
    const { status, search } = filterTaskDTO;

    let tasks = await this.taskRepository.find();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return tasks;
  }

  //get task by id
  async getTaskById(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
    return task;
  }

  //add new task
  async addTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();

    return task;
  }

  //update task status
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    task.status = status;
    await task.save();

    return task;
  }

  //remove task
  async removeTask(taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    return await task.remove();
  }
}
