const express = require('express');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  requests++;

  console.log(`Requests: ${requests}`);

  return next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const objIndex = projects.findIndex(project => project.id === id);
  if (!projects[objIndex]) {
    return res.status(404).json({ error: 'Project not exists!' });
  }

  return next();
}

let requests = 0;
const projects = [];

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const objIndex = projects.findIndex(project => project.id === id);
  projects[objIndex].title = title;

  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const objIndex = projects.findIndex(project => project.id === id);

  projects.splice(objIndex, 1);
  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const objIndex = projects.findIndex(project => project.id === id);

  projects[objIndex].tasks.push(title);

  return res.json(projects);
});

server.listen(3001);
