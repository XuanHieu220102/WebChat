import React, { useContext, useEffect } from 'react'
import { Button, Avatar, Typography } from 'antd'
import styled from 'styled-components'
import { auth, db } from '../../firebase/config';
import { AuthContext } from '../Context/AuthProvider';

const UserInforStyle = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83, 0.5);
    font-size: 16px;

    #username {
        color: white;
        margin-left: 10px;
        font-size:16px;
    }

    .user-infor {
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

    .ant-avatar {
        background: #ff0;
        color: red;
    }
    .btn-logout {
        background-color: #0A7CFF;
        border: 0px;
        color: #fff;
    }

    .btn-logout:hover {
        background-color: #fff;
        color:#000;
    }
`;
export default function UserInfor() {
    useEffect(() => {
        db.collection('users').onSnapshot((snapshot) => {
            const data = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            console.log({data, snapshot, docs: snapshot.docs});
        })
    }, [])


    const { userInfo: {
        displayName,
        photoURL
    }}= useContext(AuthContext);

    return (
        <UserInforStyle>
            <div className='user-infor'>
                <div>
                    <Avatar src={photoURL}>{photoURL ? '' : displayName?.charAt(0).toUpperCase()}</Avatar>
                    <Typography.Text id='username'>{displayName}</Typography.Text>
                </div>
                <Button className='btn-logout' onClick={() => auth.signOut()}>Đăng Xuất</Button>
            </div>
        </UserInforStyle>

    )
}
