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
  UsePipes
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilterTaskDTO } from './dto/filter-task.dto';
import { JoiValidationPipe } from '../joi-validation.pipe';
import { CreateTaskSchema, FilterTaskSchema } from './task-validation.schema';
import { TaskStatusValidation } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //GET /tasks --- Get all tasks
  @Get()
  @UsePipes(new JoiValidationPipe(FilterTaskSchema))
  async getTasks(@Query() filterTaskDTO: FilterTaskDTO): Promise<Task[]> {
    if (Object.keys(filterTaskDTO).length === 0) {
      return this.tasksService.getTasks();
    }

    return this.tasksService.getFilteredTasks(filterTaskDTO);
  }

  @Get('/:taskId')
  async getTaskById(
    @Param('taskId', ParseIntPipe) taskId: string
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  @UsePipes(new JoiValidationPipe(CreateTaskSchema))
  async addTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.addTask(createTaskDTO);
  }

  @Patch('/:taskId')
  async updateTaskStatus(
    @Param('taskId', ParseIntPipe) taskId: string,
    @Body('status', TaskStatusValidation) status: TaskStatus
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  @Delete('/:taskId')
  async removeTask(
    @Param('taskId', ParseIntPipe) taskId: string
  ): Promise<Task> {
    return this.tasksService.removeTask(taskId);
  }
}
