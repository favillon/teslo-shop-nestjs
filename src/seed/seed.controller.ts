import { Controller, Post} from '@nestjs/common';

import { Auth } from '../auth/decorators/auth.decorator';
import { SeedService } from './seed.service';
import { ValidRoles } from 'src/auth/interfaces/valid-rolres.enum';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Auth(ValidRoles.ADMIN)
  exexecuteSeed() {
    return this.seedService.runSeed();
  }
}
