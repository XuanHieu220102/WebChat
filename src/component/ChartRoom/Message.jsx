import React, { useContext } from 'react'
import { Avatar, Typography } from 'antd'
import styled from 'styled-components'
import { formatRelative } from 'date-fns/esm';
import { AppContext } from '../Context/AppProvider';
import CryptoJS from 'crypto-js'

const WrapperStyled = styled.div`
    margin-bottom: 15px;

    .author {
        margin-left: 5px;
        font-weight: bold;
        font-size: 20px;
    }

    .date {
        margin-left: 10px;
        font-size: 14px;
        color: #a7a7a7;
    }

    .content {
        margin-left: 30px;
        font-size: 18px;
    }
`;

function formatDate(seconds) {
    let formattedDate = '';  
    if (seconds) {
      formattedDate = formatRelative(new Date(seconds * 1000), new Date());
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
  }
export default function Message({ text, displayName, createAt, photoURL, key22, iv22}) {
    // const {key, iv, key2, iv2} = useContext(AppContext);
        const keyWordArray  = CryptoJS.lib.WordArray.create(JSON.parse(key22))
        const ivWordArray = CryptoJS.lib.WordArray.create(JSON.parse(iv22));
      const decryptData = (encryptedData, key, iv) => {
        const decrypted = CryptoJS.AES.decrypt(encryptedData.toString(), key, { iv });
        return decrypted.toString(CryptoJS.enc.Utf8).slice(1,-1);
      };
    return (
        <WrapperStyled>
            <div>
                <Avatar size={'small'} src={photoURL}>{photoURL ? '' : displayName.charAt(0).toUpperCase()}</Avatar>
                <Typography.Text className='author'>{displayName}</Typography.Text>
                <Typography.Text className='date' >{formatDate(createAt?.seconds)}</Typography.Text>
            </div>
            <div>
                <Typography.Text className='content'>{decryptData(text, keyWordArray.words, ivWordArray.words)}</Typography.Text>
            </div>
        </WrapperStyled>
    )
}
