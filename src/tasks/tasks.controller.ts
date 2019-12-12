import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  //GET /tasks --- Get all tasks
  @Get()
  async getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }

  @Get('/:taskId')
  async getTaskById(
    @Param('taskId', ParseIntPipe) taskId: string
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Post()
  async addTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.addTask(createTaskDTO);
  }
}
