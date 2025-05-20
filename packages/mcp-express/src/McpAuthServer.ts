import express, {Router, RequestHandler} from 'express';
import {McpAuthOptions} from '@asgardeo/mcp-node';
import protectedRoute from './middlewares/protected-route';
import AuthRouter from './routes/auth';

export class McpAuthServer {
  private options: McpAuthOptions;
  private routerInstance: Router;

  constructor(options: McpAuthOptions) {
    if (!options.baseUrl) {
      throw new Error('baseUrl must be provided');
    }
    this.options = options;
    this.routerInstance = AuthRouter(this.options);
  }

  public router(): Router {
    return this.routerInstance;
  }

  public protect(handler: RequestHandler): Router {
    const protectedRouter = express.Router();
    protectedRouter.use(protectedRoute(this.options), handler);
    return protectedRouter;
  }
}
