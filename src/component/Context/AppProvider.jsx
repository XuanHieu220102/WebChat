import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { useEffect } from 'react';
import { Spin } from 'antd';
import { useContext, useMemo } from 'react';
import { AuthContext } from './AuthProvider';
import { useFirestore } from '../../hook/useFirestore';
import CryptoJS from 'crypto-js'
import { da } from 'date-fns/locale';

export const AppContext = React.createContext();


const generateRandomKey = () => {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
};

// Sử dụng hàm generateRandomKey để lấy khóa ngẫu nhiên

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false)
  const { userInfo: { uid } } = useContext(AuthContext);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [isInviteMemberModal, setIsInviteMemberModal] = useState(false);
  const key2 = CryptoJS.lib.WordArray.random(16); // Key có độ dài 128 bits (16 bytes)
  const iv2 = CryptoJS.lib.WordArray.random(16); //IV cũng có độ dài 128 bits (16 bytes)    
  // const { key2, iv2 } = generateKeyAndIV();
  console.log("Here:", key2, iv2);
  // const key = CryptoJS.enc.Hex.parse('00112233445566778899AABBCCDDEEFF');
  // const iv = CryptoJS.enc.Hex.parse('0102030405060708');
  // console.log("Day nha: ",key, iv);
  // const secretKey = generateRandomKey();
  // console.log('Random Key:', secretKey);
  const roomsCondition = useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid
    }
  }, [uid])

  const rooms = useFirestore('rooms', roomsCondition)

  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = React.useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore('users', usersCondition);
  const encryptData = (data, key, iv) => {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, { iv });
    return encrypted.toString();
  };

  return (
    <AppContext.Provider value={{
      rooms,
      isAddRoomVisible,
      setIsAddRoomVisible,
      selectedRoomId,
      setSelectedRoomId,
      selectedRoom, members,
      isInviteMemberModal,
      setIsInviteMemberModal,
      // key,
      // iv,
      encryptData,
      key2,
      iv2,
    }}>
      {children}
    </AppContext.Provider>
  )
}
