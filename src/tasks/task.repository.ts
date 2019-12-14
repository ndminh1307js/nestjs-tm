import { NotFoundException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  //get filtered tasks by query
  async getTasks(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    const { status, search } = filterTaskDTO;
    const query = this.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` }
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  //get task by id
  async getTaskById(taskId: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id: taskId, userId: user.id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
    return task;
  }

  //add new task
  async addTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    delete task.user;

    return task;
  }

  //update task status
  async updateTaskStatus(
    taskId: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.findOne({ where: { id: taskId, userId: user.id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    task.status = status;
    await task.save();

    return task;
  }

  //remove task
  async removeTask(taskId: string, user: User): Promise<Task> {
    const task = await this.findOne({ where: { id: taskId, userId: user.id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    return await task.remove();
  }
}
