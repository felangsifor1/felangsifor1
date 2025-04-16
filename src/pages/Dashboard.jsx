import { Card, Typography } from 'antd';

const { Title } = Typography;

const Dashboard = () => (
    <div>
        <Title level={2}>Dashboard</Title>
        <Card title="Welcome to the Admin System" style={{ width: 300 }}>
            <p>This is the dashboard page.</p>
        </Card>
    </div>
);

export default Dashboard;