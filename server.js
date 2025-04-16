// server.js
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const dataFile = path.join(__dirname, 'data', 'index.json');

// 获取所有节点
app.get('/nodes', async (req, res) => {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading nodes:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// 保存节点
app.post('/nodes', async (req, res) => {
    try {
        const newNode = req.body;
        const data = await fs.readFile(dataFile, 'utf8');
        const nodes = JSON.parse(data);
        nodes.push(newNode);
        await fs.writeFile(dataFile, JSON.stringify(nodes, null, 2));
        res.json(newNode);
    } catch (error) {
        console.error('Error saving node:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// 更新节点（用于拖拽）
app.put('/nodes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNode = req.body;
        const data = await fs.readFile(dataFile, 'utf8');
        const nodes = JSON.parse(data);
        const index = nodes.findIndex((node) => node.id === id);
        if (index !== -1) {
            nodes[index] = { ...nodes[index], ...updatedNode };
            await fs.writeFile(dataFile, JSON.stringify(nodes, null, 2));
            res.json(nodes[index]);
        } else {
            res.status(404).json({ error: 'Node not found' });
        }
    } catch (error) {
        console.error('Error updating node:', error);
        res.status(500).json({ error: 'Failed to update data' });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});