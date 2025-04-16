import { Layout, Menu } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined, DotChartOutlined, BookOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: '1', icon: <HomeOutlined />, label: 'Dashboard', path: '/' },
        { key: '2', icon: <UserOutlined />, label: 'Users', path: '/users' },
        { key: '3', icon: <SettingOutlined />, label: 'Settings', path: '/settings' },
        { key: '4', icon: <BookOutlined />, label: 'Notebook',path: '/notebook' },
    ];

    const selectedKey = menuItems.find((item) => item.path === location.pathname)?.key || '1';

    const handleMenuClick = ({ key }) => {
        const selectedItem = menuItems.find((item) => item.key === key);
        if (selectedItem && selectedItem.path) {
            navigate(selectedItem.path);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]} // 动态设置选中项
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: '#fff' }} />
                <Content style={{ margin: '16px', background: '#fff', padding: 24 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;