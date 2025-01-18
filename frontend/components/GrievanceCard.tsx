"use client";
import React, { useState, useEffect } from 'react';
import Badge from './Badge';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

interface GrievanceCardProps {
    id: string;
    title: string;
    description: string;
    status: boolean;
    userImages?: string[];
    votes: number;
    adminImages?: string[];
    adminComments?: string[];
    tags?: string[];
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: '#fcffdf',
    border: '2px solid #643861',
    boxShadow: 40,
    width: 1000,
    height: 500,
    p: 4,
  };

function GrievanceCard(props: GrievanceCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [discriptionSmall, setDiscriptionSmall] = useState(props.description);
    const [userOpen, setUserOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);
    const handleUserOpen = () => setUserOpen(true);
    const handleAdminOpen = () => setAdminOpen(true);
    const handleClose = () => {
        setUserOpen(false);
        setAdminOpen(false);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
            if (props.description.length > 200) {
                setDiscriptionSmall(props.description.substring(0, 200) + "...Read More");
            } else {
                setDiscriptionSmall(props.description + "...Read More");
            }
    }, [props.description]);
    
    return (
        <div className='md:w-[50%] p-4'>
            <Modal
                open={userOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='overflow-auto flex flex-col items-center'>
                    <div className='w-full'>
                        Images
                    </div>
                    <div className='w-full h-full flex justify-center'>
                        <div className='flex gap-2 items-center justify-center'>
                            {props.userImages?.map((image, index) => (
                                <img key={index} src={image} alt="userImage" className='w-64' />
                            ))}
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={adminOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className='overflow-auto flex flex-col items-center'>
                    <div className='w-full'>
                        Images
                    </div>
                    <div className='w-full h-full flex justify-center'>
                        <div className='flex gap-2 items-center justify-center'>
                            {props.adminImages?.map((image, index) => (
                                <img key={index} src={image} alt="userImage" className='w-64' />
                            ))}
                        </div>
                    </div>
                </Box>
            </Modal>
            <div className='flex flex-col bg-[#fcffdf] min-h-52 min-w-80 sm:min-w-96 justify-between p-4 rounded-lg shadow-md shadow-[#864e82] border-2 border-solid border-[#643861]'>
                <div className='flex gap-5 items-center'>
                    <div className='flex justify-between items-center w-full'>
                        <h1 className='font-semibold text-lg'>{props.title}</h1>
                        <p className='font-light'>{props.status ? '🟢 Resolved' : '🟡 Pending'}</p>
                    </div>
                    {expanded ? (
                        <div onClick={handleExpandClick} className='text-xl h-full mr-4 text-black hover:cursor-pointer font-extrabold'>
                            ↩
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                {expanded ? (
                    <div className='items-center justify-center'>
                        <div className='mt-2 items-center'>
                            <div className='flex gap-2 flex-wrap items-center justify-center'>
                                {props.userImages?.map((image, index) => (
                                    <img key={index} src={image} onClick={handleUserOpen} alt="userImage" className='w-40 h-40' />
                                ))}
                            </div>
                            <p className='mt-2'>{props.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className='items-center flex'>
                        {props.userImages && props.userImages.length > 0 && (
                            <img src={props.userImages[0]} alt="userImage" className='w-20 h-20 mt-2 mr-4' />
                        )}
                        <p className='text-sm text-gray-500 mt-2 md:mt-0 hover:cursor-pointer' onClick={handleExpandClick}>
                            {discriptionSmall}
                        </p>
                    </div>
                )}
                <div className='flex gap-2 items-center mt-2'>
                    <div className='flex gap-2 flex-wrap'>
                        {props.tags?.map((tag, index) => (
                            <Badge key={index} tag={tag} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GrievanceCard;