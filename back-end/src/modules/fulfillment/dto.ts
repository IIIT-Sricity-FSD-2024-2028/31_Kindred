import { IsArray, IsIn, IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ResourceRequestDto {
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
  @IsIn(['collection','resource','order']) kind!: 'collection'|'resource'|'order';
  @IsString() sourceId!: string;
  @IsIn(['direct','broadcast']) mode!: 'direct'|'broadcast';
  @IsOptional() @IsString() volunteerEmail?: string;
  @IsOptional() @IsString() collectionAddress?: string;
}
export class DeliveryActionDto {
  @IsIn(['accept','decline','withdraw','picked_up','in_transit','failed','return','cancel']) action!: string;
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
  @IsString() @MinLength(1) message!: string;
  @IsOptional() @IsString() programId?: string;
}
