import React, { useContext } from 'react'
import { Form, Modal, Input } from 'antd'
import { AppContext } from '../Context/AppProvider'
import { useForm } from 'antd/es/form/Form';
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../Context/AuthProvider';
export default function AddRoomModal() {
    const {isAddRoomVisible ,setIsAddRoomVisible} = useContext(AppContext) 
    
    const [form] = useForm();
    const {userInfo: {uid}} = useContext(AuthContext);
    const handleOk = () => {
        console.log({formData: form.getFieldValue()});
        addDocument('rooms', {...form.getFieldValue(), members:[uid]})
        setIsAddRoomVisible(false)
        form.resetFields();
    }

    const handleCancel = () => {
        setIsAddRoomVisible(false);
        form.resetFields();
    }
  return (
    <Modal
        title="Tạo phòng"
        onOk={handleOk}
        onCancel={handleCancel}
        open={isAddRoomVisible}
    >
        <Form form={form} layout='vertical'>
            <Form.Item label="Tên phòng" name="name">
                <Input placeholder='Nhập tên phòng'/>
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
                <Input placeholder='Nhập mô tả'/>
            </Form.Item>
        </Form>
    </Modal>
  )
}
