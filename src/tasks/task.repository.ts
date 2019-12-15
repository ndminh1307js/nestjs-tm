import {
  NotFoundException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  //get filtered tasks by query
  async getTasks(filterTaskDTO: FilterTaskDTO, user: User): Promise<Task[]> {
    const { status, search } = filterTaskDTO;

    const query = this.createQueryBuilder('task');

    query.where('"userId"=:userId', { userId: user.id });

    if (status) {
      query.andWhere('status=:status', { status });
    }

    if (search) {
      query.andWhere('title LIKE :search OR description LIKE :search', {
        search: `%${search}%`
      });
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.verbose(
        `Failed to get tasks for ${user.username}. Filters: ${JSON.stringify(
          filterTaskDTO
        )}`
      );
      throw new InternalServerErrorException('Get tasks failed.');
    }
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
    try {
      await task.save();
      delete task.user;
      return task;
    } catch (err) {
      this.logger.verbose(
        `Could not create new task for ${user.username}. Data: ${JSON.stringify(
          createTaskDTO
        )}. Error: ${err.message}`
      );
      throw new InternalServerErrorException();
    }
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
