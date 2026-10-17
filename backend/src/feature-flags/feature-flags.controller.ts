import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FeatureFlagsService } from './feature-flags.service';

@ApiTags('Feature flags')
@Controller('feature-flags')
export class FeatureFlagsController {
  constructor(private readonly featureFlags: FeatureFlagsService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Read allowlisted public feature flag evaluations' })
  getPublicFlags() {
    return this.featureFlags.getPublicFlags();
  }
}
