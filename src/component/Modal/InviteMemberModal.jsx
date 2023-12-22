import React, { useContext, useMemo, useState, useEffect } from 'react'
import { Form, Modal, Input, Select, Spin, Avatar } from 'antd'
import { AppContext } from '../Context/AppProvider'
import { useForm } from 'antd/es/form/Form';
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../Context/AuthProvider';
import { debounce } from 'lodash';
import { db } from '../../firebase/config';

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
  }) {
    // Search: abcddassdfasdf
  
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
  
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        setOptions([]);
        setFetching(true);
  
        fetchOptions(value, curMembers).then((newOptions) => {
          setOptions(newOptions);
          setFetching(false);
        });
      };
  
      return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);
  
    useEffect(() => {
      return () => {
        // clear when unmount
        setOptions([]);
      };
    }, []);
  
    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        {...props}
      >
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            <Avatar size='small' src={opt.photoURL}>
              {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {` ${opt.label}`}
          </Select.Option>
        ))}
      </Select>
    );
  }
  
  async function fetchUserList(search, curMembers) {
    return db
      .collection('users')
      .where('keywords', 'array-contains', search?.toLowerCase())
      .orderBy('displayName')
      .limit(20)
      .get()
      .then((snapshot) => {
        return snapshot.docs
          .map((doc) => ({
            label: doc.data().displayName,
            value: doc.data().uid,
            photoURL: doc.data().photoURL,
          }))
          .filter((opt) => !curMembers.includes(opt.value));
      });
  }
  

export default function InviteMemberModal() {
    const {
        isInviteMemberModal,
        setIsInviteMemberModal,
        selectedRoomId,
        selectedRoom,
      } = useContext(AppContext);
      const [value, setValue] = useState([]);
      const [form] = useForm();
    
      const handleOk = () => {
        // reset form value
        form.resetFields();
        setValue([]);
    
        // update members in current room
        const roomRef = db.collection('rooms').doc(selectedRoomId);
    
        roomRef.update({
          members: [...selectedRoom.members, ...value.map((val) => val.value)],
        });
    
        setIsInviteMemberModal(false);
      };
    
      const handleCancel = () => {
        // reset form value
        form.resetFields();
        setValue([]);
    
        setIsInviteMemberModal(false);
      };
    
    return (
        <Modal
            title="Mời thêm thành viên"
            onOk={handleOk}
            onCancel={handleCancel}
            open={isInviteMemberModal}
        >
            <Form form={form} layout='vertical'>
                <DebounceSelect
                    mode='multiple'
                    name='search-user'
                    label='Tên các thành viên'
                    value={value}
                    placeholder='Nhập tên thành viên'
                    fetchOptions={fetchUserList}
                    onChange={(newValue) => setValue(newValue)}
                    style={{ width: '100%' }}
                    curMembers={selectedRoom.members}
                />
            </Form>
        </Modal>
    )
}
