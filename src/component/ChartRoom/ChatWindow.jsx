import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import { Avatar, Button, Tooltip, Form, Input, Alert } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import Message from './Message';
import { AppContext } from '../Context/AppProvider';
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../Context/AuthProvider';
import { useForm } from 'antd/es/form/Form';
import { useFirestore } from '../../hook/useFirestore';
import CryptoJS from 'crypto-js';
const HeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 10px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);
  padding-bottom:10px;
  background-color: rgb(0,186,255);

  h2 {
    margin-top:5px;
    margin-bottom: 8px;
  }

  .group-content {
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title { 
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;


const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;


const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding:2px 2px  2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius:2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
    padding: 5px 2px;;
  }

  input {
    padding:15px;
  }

  .ant-avatar {
    margin-left: 10px;
  }

  #invite {
    width: auto;
    height: auto;
    padding: 15px 25px;
    margin-right: 5px;
    background-color: #000;
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y:auto;
`;

export default function ChatWindow() {
  const {selectedRoom, members, setIsInviteMemberModal, key, iv, encryptData, key2, iv2  } = useContext(AppContext);
  // console.log({members});
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef(null);

  const {
    userInfo: { uid, photoURL, displayName },
  } = useContext(AuthContext);
  const [form] = useForm()
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  const handleOnSubmit = () => {
    const keyJS = JSON.stringify(key2);
    const ivJS = JSON.stringify(iv2);
    addDocument('messages', {
      text: encryptData(inputValue, key2, iv2),
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName,
      key: keyJS,
      iv:ivJS,
    });
    form.resetFields(['message'])
  }

  const condition = React.useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: selectedRoom.id,
    }),
    [selectedRoom.id]
  );

  const messages = useFirestore('messages', condition);
  console.log(messages);  
  // const keyWordArray = CryptoJS.lib.WordArray.create(JSON.parse(messages[0].key));
  // const ivWordArray = CryptoJS.lib.WordArray.create(JSON.parse(messages[0].iv));
  // console.log("1223123",keyWordArray);
  // console.log("21313",ivWordArray);
  useEffect(() => {
    // scroll to bottom after message changed
    if (messageListRef?.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 50;
    }
  }, [messages]);
  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
      <HeaderStyle>
        <div>
          <h2>{selectedRoom.name}</h2>
          <span>{selectedRoom.description}</span>
        </div>
        <div className='group-content'>
          <Button id='btn-invite' icon={<UserAddOutlined />} onClick={() => setIsInviteMemberModal(true)}>Mời</Button>
          <Avatar.Group size='small' maxCount={2}>
                {members.map((member) => (
                  <Tooltip title={member.displayName} key={member.id}>
                    <Avatar src={member.photoURL}>
                      {member.photoURL
                        ? ''
                        : member.displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
              </Avatar.Group>
        </div>
      </HeaderStyle>
      <ContentStyled>
      <MessageListStyled ref={messageListRef} >
              {messages.map((mes) => (
                <Message
                  id={mes.id}
                  text={mes.text}
                  photoURL={mes.photoURL}
                  displayName={mes.displayName}
                  createAt={mes.createAt}
                  key22={mes.key}
                  iv22={mes.iv}
                />
              ))}
            </MessageListStyled>
        <FormStyled form={form}>
          <Form.Item name='message' >
            <Input
            onChange={handleInputChange}
            onPressEnter={handleOnSubmit}
            placeholder='Nhập tin nhắn của bạn' bordered={true} autoComplete='off'
            
            />
          </Form.Item>
          <Button className='btn-send-message' onClick={handleOnSubmit}>Gửi</Button>
        </FormStyled>

      </ContentStyled>          
        </>
      ) : (
        <Alert
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{ margin: 5 }}
          closable
        />
      )}

    </WrapperStyled>

  )
}
