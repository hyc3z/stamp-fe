/**
 * 路由组件出口文件
 * yezi 2018年6月24日
 */
import Loadable from 'react-loadable';
import Loading from './widget/Loading';
import BasicForm from './forms/BasicForm';
import BasicTable from './tables/BasicTables';
import AdvancedTable from './tables/AdvancedTables';
import ScriptTable from './tables/ScriptTable';
import AsynchronousTable from './tables/AsynchronousTable';
import Echarts from './charts/Echarts';
import Recharts from './charts/Recharts';
import Icons from './ui/Icons';
import Buttons from './ui/Buttons';
import Spins from './ui/Spins';
import Modals from './ui/Modals';
import Notifications from './ui/Notifications';
import Tabs from './ui/Tabs';
import Banners from './ui/banners';
import Drags from './ui/Draggable';
import Dashboard from './dashboard/Dashboard';
import Gallery from './ui/Gallery';
import BasicAnimations from './animation/BasicAnimations';
import ExampleAnimations from './animation/ExampleAnimations';
import Cssmodule from './cssmodule';
import MapUi from './ui/map';
import QueryParams from './extension/QueryParams';
import MyFileBrowser from './filebrowser/FileBrowser';
// import MyResultBrowser from '../filebrowser/ResultBrowser';
import Terminal from './terminal/Terminal';
import EditableTable from './tables/EditableTable';
import PartitionTable from './tables/PartitionTable';
import TaxTable from './tables/TaxTable';
import HycChart from './charts/HycChart';
import ClusterConfig from './forms/ClusterConfig'
const WysiwygBundle = Loadable({
    // 按需加载富文本配置
    loader: () => import('./ui/Wysiwyg'),
    loading: Loading,
});

export default {
    BasicForm,
    BasicTable,
    AdvancedTable,
    EditableTable,
    PartitionTable,
    ScriptTable,
    MyFileBrowser,
    // MyResultBrowser,
    ClusterConfig,
    HycChart,
    AsynchronousTable,
    Echarts,
    Recharts,
    Icons,
    Buttons,
    Spins,
    Modals,
    Notifications,
    Tabs,
    Banners,
    Drags,
    Dashboard,
    Gallery,
    BasicAnimations,
    ExampleAnimations,
    WysiwygBundle,
    Cssmodule,
    MapUi,
    TaxTable,
    QueryParams,
    Terminal,
} as any;
