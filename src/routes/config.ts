
export interface IFMenuBase {
    key: string;
    title: string;
    icon?: string;
    component?: string;
    query?: string;
    auth?: string;
    route?: string;
    login?: string;
}

export interface IFMenu extends IFMenuBase {
    subs?: IFMenuBase[];
}

export const AdminMenu: {
    menus: IFMenu[];
    others: IFMenu[] | [];
    [index: string]: any;
} = {
    menus: [
        // 菜单相关路由
        // { key: '/app/dashboard/index', title: '首页', icon: 'mobile', component: 'Dashboard' },
        {
            key: '/hpc/task',
            title: '任务管理',
            icon: 'copy',
            subs: [
                { key: '/hpc/task/taskList', title: '任务列表', component: 'AdvancedTable' },
                { key: '/hpc/task/taskCreate', title: '任务创建', component: 'BasicForm' },
                { key: '/hpc/task/taskEnv', title: '环境变量配置', component: 'EditableTable' },
                { key: '/hpc/task/partition', title: '队列管理', component: 'PartitionTable' },
            ],
        },
        {
            key: '/hpc/cluster',
            title: '集群管理',
            icon: 'area-chart',
            subs: [
                { key: '/hpc/cluster/monitor', title: '集群监控', component: 'HycChart' },
                // { key: '/hpc/cluster/terminal', title: '控制台', component: 'Terminal' }
                { key: '/hpc/cluster/usageReport', title: '计费报表', component: 'TaxTable'}
            ],
        },
        {
            key: '/hpc/files',
            title: '文件管理',
            icon: 'database',
            component: 'MyFileBrowser',
        },
        {
            key: '/hpc/script',
            title: '脚本管理',
            icon: 'edit',
            subs: [
                // { key: '/hpc/script/list', title: '脚本列表', component: 'ScriptTable' },
                { key: '/hpc/script/edit', title: '脚本编辑', component: 'WysiwygBundle' },
            ],
        },
        {
            key: '/hpc/info',
            title: '操作说明',
            icon: 'search',
        },
    ],
    others: [], // 非菜单相关路由
};

export const UserMenu: {
    menus: IFMenu[];
    others: IFMenu[] | [];
    [index: string]: any;
} = {
    menus: [
        // 菜单相关路由
        // { key: '/app/dashboard/index', title: '首页', icon: 'mobile', component: 'Dashboard' },
        {
            key: '/hpc/task',
            title: '任务管理',
            icon: 'copy',
            subs: [
                { key: '/hpc/task/taskList', title: '任务列表', component: 'AdvancedTable' },
                { key: '/hpc/task/taskCreate', title: '任务创建', component: 'BasicForm' },
            ],
        },
        {
            key: '/hpc/cluster',
            title: '集群管理',
            icon: 'area-chart',
            subs: [
                { key: '/hpc/cluster/monitor', title: '集群监控', component: 'Echarts' },
                // { key: '/hpc/cluster/terminal', title: '控制台', component: 'Terminal' }
            ],
        },
        {
            key: '/hpc/script',
            title: '脚本管理',
            icon: 'edit',
            subs: [
                // { key: '/hpc/script/list', title: '脚本列表', component: 'ScriptTable' },
                { key: '/hpc/script/edit', title: '脚本编辑', component: 'WysiwygBundle' },
            ],
        },
        {
            key: '/hpc/files',
            title: '文件管理',
            icon: 'database',
            component: 'MyFileBrowser',
        },
        {
            key: '/hpc/info',
            title: '操作说明',
            icon: 'search',
        },
    ],
    others: [], // 非菜单相关路由
};

export default AdminMenu;
