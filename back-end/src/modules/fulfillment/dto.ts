import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ResourceRequestDto {
  @IsOptional() @IsString() unit?:string;
  @IsString() @MinLength(1) orgName!: string;
  @IsString() @MinLength(1) resource!: string;
  @IsInt() @Min(1) quantity!: number;
  @IsString() @MinLength(1) reason!: string;
  @IsString() @MinLength(1) address!: string;
  @IsString() @MinLength(1) phone!: string;
  @IsString() @MinLength(1) name!: string;
  @IsOptional() @IsString() photoUrl?: string;
}
export class StockAllocationDto {
  @IsString() stockId!: string;
  @IsInt() @Min(1) quantity!: number;
}
export class ResourceResponseDto {
  @IsIn(['approve','reject','information','waiting_stock','cancel']) decision!: string;
  @IsString() @MinLength(1) message!: string;
  @IsOptional() @IsArray() @ValidateNested({each:true}) @Type(()=>StockAllocationDto) allocations?: StockAllocationDto[];
  @IsOptional() @IsString() programId?: string;
}
export class DeliveryOfferDto {
  @IsOptional() @IsString() pickupAddress?:string;
  @IsOptional() @IsString() scheduledDate?:string;
  @IsOptional() @IsString() shiftStart?:string;
  @IsOptional() @IsString() shiftEnd?:string;
  @IsOptional() @IsString() pickupArea?:string;
  @IsOptional() @IsString() destinationArea?:string;
  @IsOptional() @IsString() requirements?:string;
  @IsIn(['collection','resource','order']) kind!: 'collection'|'resource'|'order';
  @IsString() sourceId!: string;
  @IsIn(['direct','broadcast']) mode!: 'direct'|'broadcast';
  @IsOptional() @IsString() volunteerEmail?: string;
  @IsOptional() @IsString() collectionAddress?: string;
}
export class DeliveryActionDto {
  @IsOptional() @IsBoolean() confirmAvailability?:boolean;
  @IsOptional() @IsBoolean() confirmConflict?:boolean;
  @IsOptional() @IsString() reviewedVersion?:string;
  @IsIn(['accept','decline','withdraw','picked_up','in_transit','failed','return','cancel','report']) action!: string;
  @IsOptional() @IsString() reason?: string;
}
export class ReceiptDto {
  @IsArray() @ValidateNested({each:true}) @Type(()=>ReceivedItemDto) items!: ReceivedItemDto[];
}
export class ReceivedItemDto {
  @IsInt() @Min(0) index!: number;
  @IsInt() @Min(0) quantity!: number;
}
export class RequestUpdateDto {
  @IsOptional() @IsIn(['received','issue','investigate','resolve','close','reopen']) action?:string;
  @IsString() @MinLength(1) message!: string;
  @IsOptional() @IsString() programId?: string;
}
