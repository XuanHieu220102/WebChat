import React, { useContext, useMemo } from 'react'
import { Collapse, Typography, Button} from 'antd'
import {PlusSquareOutlined} from '@ant-design/icons'
import styled from 'styled-components'
import { useFirestore } from '../../hook/useFirestore'
import { AuthContext } from '../Context/AuthProvider';
import { AppContext } from '../Context/AppProvider'

const { Panel } = Collapse;


const CustomCollapse = styled(Collapse)`
//   background-color: #f0f0f0;
  color: white;
  border: 1px solid rgba(82, 38, 83, 0.5);
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
    .ant-collapse-panel-header {
        color: white;
    }
    .ant-collapse-expand-icon, .ant-collapse-header-text {
        color: white;
    }
  .ant-collapse-content-box {
    display: flex;
    flex-direction: column;
  }
  .ant-typography {
    color: white;
    font-size:15px;
    text-align: center;
    padding-bottom: 5px;
    witdh: 100%;
  }
  .ant-typography:hover{
    background-color: #02AFAE;
    color: #FF2531;
  }
  .add-room {
    color: white;
    margin-bottom: 5px;
  }

  .add-room:hover{
    color:blue !important;
  }

  .header {
    font-size: 15px;
  }
`;

export default function RoomList() {
  const {rooms,isAddRoomVisible ,setIsAddRoomVisible,selectedRoomId, setSelectedRoomId} = useContext(AppContext) 
  console.log(rooms);
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
    console.log(isAddRoomVisible);
  }
    return (
        <CustomCollapse>
            <Collapse ghost defaultActiveKey={['1']}>
                <Panel className='header' header="Danh sách các phòng" key='1'>
                  {
                    rooms.map(room => <Typography.Link key={room.id} onClick={() => setSelectedRoomId(room.id)}>{room.name}</Typography.Link>)
                  }
                    <Button type = 'text' icon={<PlusSquareOutlined/>}  className='add-room' onClick={handleAddRoom}>Thêm phòng</Button>
                </Panel>
            </Collapse>
        </CustomCollapse>

    )
}
