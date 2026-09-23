import { Module } from "@nestjs/common";
import { HhSyncService } from "./hh-sync.service";

@Module({
  providers: [HhSyncService],
  exports: [HhSyncService],
})
export class HhSyncModule {}
