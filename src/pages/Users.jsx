import { Table, Typography } from 'antd';

const { Title } = Typography;

const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
];

const data = [
    { key: '1', name: 'John Doe', age: 32, address: 'New York' },
    { key: '2', name: 'Jane Smith', age: 28, address: 'London' },
];

const Users = () => (
    <div>
        <Title level={2}>Users</Title>
        <Table columns={columns} dataSource={data} />
    </div>
);

export default Users;