import { Row, Col } from 'antd'
import React from 'react'
import UserInfor from './UserInfor'
import RoomList from './RoomList'
import styled from 'styled-components'

const SideBarStyle = styled.div`
    background: #000;
    color: white;
    height: 100vh;

    .box-descrip {
        text-align: center;
        height: 100%;
        width: 25%;
        position: fixed;
        top:75%;
    }

    .footer-des {
        color: #EF559C;
    }
`;

export default function SideBar() {
    return (
        <SideBarStyle>
            <Row>
                <Col span={24} ><UserInfor /></Col>
                <Col span={24} ><RoomList /></Col>
            </Row>
            <div className='box-descrip'>
                <h1 className='footer-des'>Hang out<br />
                    anytime,<br />
                    anywhere</h1>
                <p>Messenger makes it easy and fun to stay close to your<br />
                    favourite people.</p>
            </div>

        </SideBarStyle>

    )
}
