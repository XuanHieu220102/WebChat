import React from 'react'
import { Row, Col, Button, Typography } from 'antd'
const { Title } = Typography
import { auth, db } from '../../firebase/config'
import firebase from '../../firebase/config'
import { useNavigate } from 'react-router-dom';
import { addDocument } from '../../firebase/service'
import { generateKeywords } from '../../firebase/service'
import styled from 'styled-components'

const fbProvider = new firebase.auth.FacebookAuthProvider();


const LoginStyle = styled.div`
    width: 500px;
    height: 500px;
    margin-left:auto;
    margin-right:auto;
    border: 1px solid rgb(230, 230, 230);
    background-color: #C0C0C240;
    margin-top:200px;
    border-radius: 25px;
`;

export default function Login() {
    const handleFbLogin = async () => {
        console.log(fbProvider);
        const { additionalUserInfo, user } = await auth.signInWithPopup(fbProvider)
        console.log(user);
        if (additionalUserInfo?.isNewUser) {
            addDocument('users', {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName?.toLowerCase())
            })
        }
    }


    return (
        <div>
            <Row justify='center' style={{ height: 800 }}>
                <LoginStyle>
                    <div className='box-login'>
                        <Button style={{ width: 'auto', marginTop:'45%', marginLeft:'32%', backgroundColor:'blue', color:'white'}} onClick={handleFbLogin}>
                            Đăng nhập bằng Facebook
                        </Button>
                    </div>
                </LoginStyle>


            </Row>
        </div>
    )
}
