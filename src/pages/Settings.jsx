import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const Settings = () => (
    <div>
        <Title level={2}>Settings</Title>
        <Form layout="vertical">
            <Form.Item label="Username">
                <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item label="Email">
                <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item>
                <Button type="primary">Save</Button>
            </Form.Item>
        </Form>
    </div>
);

export default Settings;