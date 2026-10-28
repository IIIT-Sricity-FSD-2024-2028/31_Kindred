import { Module } from '@nestjs/common';
import { ProofsController } from './controller';
import { TasksModule } from '../tasks/module';
import { SubtasksModule } from '../subtasks/module';
import { ResourceDonationsModule } from '../resource-donations/module';
import { OrdersModule } from '../orders/module';
import { ReplacementsModule } from '../replacements/module';
import { IncomingModule } from '../incoming/module';
import { HourLogsModule } from '../hour-logs/module';
import { ProgramsModule } from '../programs/module';
import { VolunteersModule } from '../volunteers/module';
@Module({ imports: [TasksModule, SubtasksModule, ResourceDonationsModule, OrdersModule, ReplacementsModule, IncomingModule, HourLogsModule, ProgramsModule, VolunteersModule], controllers: [ProofsController] })
export class ProofsModule {}
