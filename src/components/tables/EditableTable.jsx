import { Table, Input, Button, Popconfirm, Form } from 'antd';
import React from 'react';
import './editable.css';
import Axios from 'axios';
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '变量名',
        dataIndex: 'envKey',
        width: '30%',
        editable: true,
      },
      {
        title: '变量值',
        dataIndex: 'envVal',
        width: '30%',
        editable: true,
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确认删除?" onConfirm={() => this.handleDelete(record)}>
              <a>删除</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [],
      count: 0,
    };
  }

  componentDidMount = async () => {
    await this.getEnv()
  }

  async getEnv() {
    Axios.get("/config/env").then(
      data => {
          let res = data.data
          console.log("env",res)
          this.setState({ dataSource: res, count: data.length})
      }
  )
  }

  async storeEnv(envId, envKey, envVal) {
    console.log("storeEnv",envId,envKey,envVal)
    Axios({
      method: "GET",
      url: "/config/storeEnv",
      headers: {
        "stamp_user_env_id": envId,
        "stamp_user_env_key": envKey,
        "stamp_user_env_val": envVal
      }
    }).then()
  }
  async deleteEnv(envId) {
    Axios({
      method: "GET",
      url: "/config/deleteEnv",
      headers: {
        "stamp_user_env_id": envId,
      }
    }).then()
  }

  
  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    console.log(key)
    this.deleteEnv(key.envId)
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      envId: -1,
      envKey: "PATH",
      envVal: "/usr/bin"
    };
    this.storeEnv(newData.envId, newData.envKey, newData.envVal)
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    console.log("editing:", row);
    this.storeEnv(row.envId, row.envKey, row.envVal)
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className="editable-div">
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          添加环境变量
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

export default EditableTable