import { useState, useEffect } from 'react';
import { Modal, Select, Button, Input, message } from 'antd';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/theme-monokai';

const { Option } = Select;

const CodeModal = ({ visible, onClose, initialLanguage = 'javascript', onSave }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(initialLanguage);
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLanguage(initialLanguage);
    }, [initialLanguage]);

    const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'html', label: 'HTML' },
        { value: 'sh', label: 'Bash' },
    ];

    const handleSave = () => {
        if (!title.trim()) {
            message.error('Title is required!');
            return;
        }
        setIsLoading(true);
        const data = { title, language, code };
        setTimeout(() => {
            onSave(data);
            message.success('Code saved successfully!');
            setIsLoading(false);
            onClose();
            setCode('');
            setTitle('');
        }, 1000);
    };

    return (
        <Modal
            title="Code Input"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="save" type="primary" loading={isLoading} onClick={handleSave}>
                    Save
                </Button>,
            ]}
            width={800}
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <Select
                    value={language}
                    style={{ width: 120 }}
                    onChange={(value) => setLanguage(value)}
                >
                    {languages.map((lang) => (
                        <Option key={lang.value} value={lang.value}>
                            {lang.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <AceEditor
                mode={language}
                theme="monokai"
                value={code}
                onChange={setCode}
                name="code-editor"
                editorProps={{ $blockScrolling: true }}
                style={{ width: '100%', height: '400px' }}
            />
        </Modal>
    );
};

export default CodeModal;