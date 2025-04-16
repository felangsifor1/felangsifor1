import React, { useState, useEffect, useRef } from 'react';
import CodeModal from '../components/CodeModal';
import styles from './Matrixdoc.module.less';

const Matrixdoc = () => {
    const [scale, setScale] = useState(1);
    const [matrix, setMatrix] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [clickCounts, setClickCounts] = useState({});
    const [hoveredCell, setHoveredCell] = useState(null);
    const containerRef = useRef(null);

    // Load matrix data from document.json (simulated fetch)
    useEffect(() => {
        const fetchMatrixData = async () => {
            // In a real app, you'd fetch from document.json
            const initialData = { matrix: [] };
            setMatrix(initialData.matrix);
        };
        fetchMatrixData();
    }, []);

    // Zoom functionality with CTRL + scroll or touchpad
    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
                setScale(Math.max(0.5, Math.min(newScale, 3)));
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                    touch1.pageX - touch2.pageX,
                    touch1.pageY - touch2.pageY
                );
                const newScale = distance / 100;
                setScale(Math.max(0.5, Math.min(newScale, 3)));
            }
        };

        const container = containerRef.current;
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchmove', handleTouchMove);
        };
    }, [scale]);

    // Generate infinite grid (simplified for demo)
    const generateGrid = () => {
        const gridSize = 10; // Adjust based on scale
        const grid = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cellData = matrix.find(cell => cell.x === i && cell.y === j);
                grid.push({ x: i, y: j, data: cellData?.data || null });
            }
        }
        return grid;
    };

    const handleCellClick = (cell) => {
        setSelectedCell(cell);
        setClickCounts(prev => ({
            ...prev,
            [`${cell.x}-${cell.y}`]: (prev[`${cell.x}-${cell.y}`] || 0) + 1,
        }));
        setModalVisible(true);
    };

    const handleSave = (title, content) => {
        const newMatrix = [...matrix];
        const cellIndex = newMatrix.findIndex(
            cell => cell.x === selectedCell.x && cell.y === selectedCell.y
        );
        if (cellIndex >= 0) {
            newMatrix[cellIndex] = { x: selectedCell.x, y: selectedCell.y, data: { title, content } };
        } else {
            newMatrix.push({ x: selectedCell.x, y: selectedCell.y, data: { title, content } });
        }
        setMatrix(newMatrix);
        setModalVisible(false);
    };

    const handleDelete = (cell) => {
        setMatrix(matrix.filter(c => !(c.x === cell.x && c.y === cell.y)));
    };

    const handleEdit = (cell) => {
        setSelectedCell(cell);
        setModalVisible(true);
    };

    const handleCopy = (cell) => {
        const cellData = matrix.find(c => c.x === cell.x && c.y === cell.y);
        if (cellData) {
            const newCell = { ...cellData, x: cell.x + 1, y: cell.y + 1 };
            setMatrix([...matrix, newCell]);
        }
    };

    const grid = generateGrid();

    return (
        <div className={styles.matrix_container} ref={containerRef}>
            <div
                className={styles.matrix_grid}
                style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
            >
                {grid.map(cell => (
                    <div
                        key={`${cell.x}-${cell.y}`}
                        className={styles.matrix_cell}
                        onClick={() => handleCellClick(cell)}
                        onMouseEnter={() => setHoveredCell(cell)}
                        onMouseLeave={() => setHoveredCell(null)}
                    >
                        {cell.data ? (
                            <div className={styles.cell_content}>
                                <h3>{cell.data.title}</h3>
                                <p>{cell.data.content}</p>
                            </div>
                        ) : (
                            <div className={styles.empty_cell}>Click to add</div>
                        )}
                        {hoveredCell?.x === cell.x && hoveredCell?.y === cell.y && cell.data && (
                            <div className={styles.cell_actions}>
                                <button onClick={() => handleEdit(cell)}>Edit</button>
                                <button onClick={() => handleDelete(cell)}>Delete</button>
                                <button onClick={() => handleCopy(cell)}>Copy</button>
                            </div>
                        )}
                        <div className={styles.click_count}>
                            Clicks: {clickCounts[`${cell.x}-${cell.y}`] || 0}
                        </div>
                    </div>
                ))}
            </div>
            <CodeModal
                visible={modalVisible}
                onSave={handleSave}
                onClose={() => setModalVisible(false)}
                initialData={selectedCell?.data || { title: '', content: '' }}
            />
        </div>
    );
};

export default Matrixdoc;