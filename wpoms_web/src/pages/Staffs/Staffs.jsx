import React, { useState } from 'react';
import {authService} from '../../services/authService';
import { profileService } from '../../services/profileService'; 
import { useEffect } from 'react';
import './Staffs.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().min(2, 'Email is required').max(40).email('Email is required'),
    password: z.string().min(8,'Password atleast 8 characters required'),
    phone: z.string().min(10,'Minimum 10 numbers required').max(14, 'Maximum 14 numbers only'),
    department: z.string().min(1, 'Department is required')
});

const Staffs = ({type}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            department: ''
        }
    });

    const onSubmit = async (data) => {
    try {
        const response = await authService.registerStaff(type,data); 


        const updatedStaffs = await profileService.getStaffs(type); 

        // add avatarText (since backend won't send it)
        const formatted = updatedStaffs.map(s => ({
            ...s,
            avatarText: s.name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'NS'
        }));

        setStaffs(formatted);

        setIsModalOpen(false);
        reset();

        toast.success('Staff added successfully');
    } catch (err) {
        toast.error(err.message || 'Failed to add staff');
    }
};

useEffect(() => {
    const fetchStaffs = async () => {
        try {
            const data = await profileService.getStaffs(type);

            const formatted = data.map(s => ({
                ...s,
                avatarText: s.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'NS'
            }));

            setStaffs(formatted);
        } catch (error) {
            toast.error(error.message||'Failed to load staffs');
        }
    };

    fetchStaffs();
}, [type]);

    return (
        <div className="staffs-container">
        

            <div className="staffs-header">
                <div>
                    <h1 className="staffs-title">Staff Management</h1>
                    <p className="staffs-subtitle">Manage your staffs here....</p>
                </div>
                <button className="btn-create-staff gold-gradient" onClick={() => setIsModalOpen(true)}>
                    <span className="material-symbols-outlined">add</span> CREATE STAFF
                </button>
            </div>

            <div className="staffs-table-wrapper">
                <div className="staffs-table-header">
                    <h2>Staff Details</h2>
                </div>
                <table className="staffs-table">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL ADDRESS</th>
                            <th>PHONE NUMBER</th>
                            <th>DEPARTMENT</th>
                            <th className="text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffs.map((staff) => (
                            <tr key={staff.id}>
                                <td>
                                    <div className="staff-name-col">
                                        <div className="staff-avatar-mini">{staff.avatarText}</div>
                                        <div className="staff-name-info">
                                            <div className="staff-fullname">{staff.name}</div>
                                            <div className="staff-role">{staff.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{staff.email}</td>
                                <td>{staff.phone}</td>
                                <td>
                                    <span className="staff-department-badge">{staff.department}</span>
                                </td>
                                <td className="text-right staff-actions">
                                    <button className="action-icon-btn" title="Edit">
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                    <button className="action-icon-btn delete-icon" title="Delete">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">New Staff Member</h2>
                            </div>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="modal-form" autoComplete="off">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>FULL NAME</label>
                                    <input type="text" {...register('name')} className={errors.name ? 'error-input' : ''}/>
                                    {errors.name && <p className="error">{errors.name.message}</p>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>EMAIL ADDRESS</label>
                                    <input type="email" autoComplete="new-email" {...register('email')}  className={errors.email ? 'error-input' : ''} />
                                    {errors.email && <p className="error">{errors.email.message}</p>}
                                </div>

                                 <div className="form-group">
                                    <label>PASSWORD</label>
                                    <div className="password-input-wrapper">
                                        <input type={showPassword ? "text" : "password"} autoComplete="new-password" {...register('password')} className={errors.password ? 'error-input' : ''} />
                                        <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>
                                                {showPassword ? "visibility_off" : "visibility"}
                                            </span>
                                        </button>
                                    </div>
                                    {errors.password && <p className="error">{errors.password.message}</p>}
                                </div>

                                <div className="form-group">
                                    <label>PHONE NUMBER</label>
                                    <input type="text" {...register('phone')}  className={errors.phone ? 'error-input' : ''} />
                                    {errors.phone && <p className='error'>{errors.phone.message}</p>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>DEPARTMENT</label>
                                <input type="text" {...register('department')} className={errors.department ? 'error-input' : ''} />
                                {errors.department && <p className="error">{errors.department.message}</p>}
                            </div>

                            <div className="modal-footer">
                                {/* <div className="modal-left">
                                    <button type="button" className="btn-clear" onClick={() => reset()}>CLEAR</button>
                                </div> */}
                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>CANCEL</button>
                                    <button type="button" className="btn-clear" onClick={() => reset()}>CLEAR</button>
                                    <button type="submit" className="btn-submit gold-gradient">CREATE STAFF ACCOUNT</button>
                                </div>
                            </div>
                        </form> 
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staffs;
