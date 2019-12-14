import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private readonly taskRepository: TaskRepository
  ) {}

  //get filtered tasks by query
  async getTasks(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterTaskDTO, user);
  }

  //get task by id
  async getTaskById(taskId: string, user: User): Promise<Task> {
    return this.taskRepository.getTaskById(taskId, user);
  }

  //add new task
  async addTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.addTask(createTaskDTO, user);
  }

  //update task status
  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    return this.taskRepository.updateTaskStatus(taskId, status, user);
  }

  //remove task
  async removeTask(taskId: string, user: User): Promise<Task> {
    return this.taskRepository.removeTask(taskId, user);
  }
}
