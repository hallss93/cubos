import { Request } from 'express';
import { RestController, GET } from 'express-power-router';

@RestController('/')
class BadgeRouter {
  @GET('/')
  list(req: Request): any {
    return [{ ok: true }];
  }
}
