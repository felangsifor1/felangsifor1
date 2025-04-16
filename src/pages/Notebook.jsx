import { useState, useEffect } from 'react';
import { Button, Dropdown, Menu, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Draggable from 'react-draggable';
import axios from 'axios';
import CodeModal from '../components/CodeModal';
import styles from './Notebook.module.less';

const { Title, Text } = Typography;

const Notebook = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [nodes, setNodes] = useState([]);
    const [isDraggingNode, setIsDraggingNode] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        axios.get('/api/nodes')
            .then((response) => {
                console.log('Loaded nodes:', response.data);
                setNodes(response.data.map((item, index) => ({
                    id: item.id || `node-${index}`,
                    title: item.title || 'Untitled',
                    language: item.language || 'javascript',
                    code: item.code || '',
                    position: item.position || { x: 100 + index * 50, y: 100 + index * 50 },
                })));
            })
            .catch((error) => {
                console.error('Failed to load nodes:', error.response?.data || error.message);
            });
    }, []);

    const handleSave = (data) => {
        const newNode = {
            id: `node-${nodes.length}`,
            title: data.title,
            language: data.language,
            code: data.code,
            position: { x: 100 + nodes.length * 50, y: 100 + nodes.length * 50 },
        };
        axios.post('/api/nodes', newNode)
            .then((response) => {
                console.log('Saved node:', response.data);
                setNodes([...nodes, newNode]);
            })
            .catch((error) => {
                console.error('Failed to save node:', error.response?.data || error.message);
            });
    };

    const handleDragStart = (e) => {
        setIsDraggingNode(true);
        e.stopPropagation();
    };

    const handleDragStop = (id, e, data) => {
        setIsDraggingNode(false);
        const updatedNode = nodes.find((node) => node.id === id);
        if (updatedNode) {
            const gridSize = 50;
            const newNode = {
                ...updatedNode,
                position: {
                    x: Math.round(data.x / gridSize) * gridSize,
                    y: Math.round(data.y / gridSize) * gridSize,
                },
            };
            axios.put(`/api/nodes/${id}`, newNode)
                .then(() => {
                    setNodes(nodes.map((node) =>
                        node.id === id ? newNode : node
                    ));
                })
                .catch((error) => {
                    console.error('Failed to update node:', error.response?.data || error.message);
                });
        }
    };

    const menu = (
        <Menu
            onClick={({ key }) => {
                setSelectedLanguage(key);
                setModalVisible(true);
            }}
        >
            <Menu.Item key="javascript">JavaScript</Menu.Item>
            <Menu.Item key="html">HTML</Menu.Item>
            <Menu.Item key="sh">Bash</Menu.Item>
        </Menu>
    );

    return (
        <div className={styles.noteBox}>
            <div className={styles.header}>
                <Title level={2}>Notebook</Title>
                <Dropdown overlay={menu} trigger={['hover']}>
                    <Button type="primary" icon={<PlusOutlined />}>
                        新增
                    </Button>
                </Dropdown>
            </div>
            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={2}
                centerOnInit
                initialPositionX={0}
                initialPositionY={0}
                panning={{ disabled: isDraggingNode }}
                wheel={{ wheelDisabled: false }}
                velocityAnimation={false}
                onZoom={(ref) => setScale(ref.state.scale)}
                limitToBounds={true}
            >
                <div className={styles.transformWrapper}>
                    <div className={styles.notebook} /> {/* 固定背景 */}
                    <TransformComponent wrapperClass={styles.transformContent}>
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            {nodes.map((node) => (
                                <Draggable
                                    key={node.id}
                                    defaultPosition={node.position}
                                    onStart={handleDragStart}
                                    onStop={(e, data) => handleDragStop(node.id, e, data)}
                                    scale={scale}
                                >
                                    <div
                                        style={{
                                            width: 300,
                                            padding: 16,
                                            background: '#fff',
                                            border: '1px solid #d9d9d9',
                                            borderRadius: 4,
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                            cursor: 'move',
                                            zIndex: 1000,
                                            position: 'absolute',
                                        }}
                                    >
                                        <h3>{node.title}</h3>
                                        <p><strong>Language:</strong> {node.language}</p>
                                        <Text
                                            ellipsis={{ tooltip: node.code }}
                                            style={{ display: 'block', maxHeight: '60px', overflow: 'hidden' }}
                                        >
                                            {node.code}
                                        </Text>
                                    </div>
                                </Draggable>
                            ))}
                        </div>
                    </TransformComponent>
                </div>
            </TransformWrapper>
            <CodeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                initialLanguage={selectedLanguage}
                onSave={handleSave}
            />
        </div>
    );
};

export default Notebook;