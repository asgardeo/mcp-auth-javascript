import express from 'express';

const router = express.Router();

// Protected resource endpoints
router.get('/profile', (req, res) => {
  // The user information would be available in req.user after MCP authentication
  res.json({
    message: 'This is a protected profile endpoint'
  });
});

router.get('/resources', (req, res) => {
  res.json({
    message: 'This is a protected resources endpoint',
    data: [
      {id: 1, name: 'Protected Resource 1'},
      {id: 2, name: 'Protected Resource 2'},
    ],
  });
});

export {router as protectedRoutes};
