import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({status: 'ok'});
});

router.get('/info', (req, res) => {
  res.json({
    name: 'MCP Express Example',
    description: 'Example application demonstrating MCP authorization using Asgardeo',
  });
});

export {router as publicRoutes};
