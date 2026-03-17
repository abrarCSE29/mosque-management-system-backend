import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Notice how we inject the validate middleware before the controller!
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;