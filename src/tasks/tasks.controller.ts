import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
  UsePipes,
  UseGuards
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { JoiValidationPipe } from '../joi-validation.pipe';
import { CreateTaskSchema, FilterTaskSchema } from './task-validation.schema';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //GET /tasks --- Get all tasks
  @Get()
  async getTasks(
    @Query(new JoiValidationPipe(FilterTaskSchema))
    filterTaskDTO: FilterTaskDTO,
    @GetUser() user: User
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterTaskDTO, user);
  }

  @Get('/:taskId')
  async getTaskById(
    @Param('taskId', ParseIntPipe) taskId: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Post()
  async addTask(
    @Body(new JoiValidationPipe(CreateTaskSchema)) createTaskDTO: CreateTaskDTO,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.addTask(createTaskDTO, user);
  }

  @Patch('/:taskId')
  async updateTaskStatus(
    @Param('taskId', ParseIntPipe) taskId: string,
    @Body('status', TaskStatusValidation) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }

  @Delete('/:taskId')
  async removeTask(
    @Param('taskId', ParseIntPipe) taskId: string,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.removeTask(taskId, user);
  }
}
