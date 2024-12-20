"use client";
import React, {useState, useEffect} from 'react'

interface GrievanceCardProps {
    title: string
    description: string
    status: boolean
    userImages?: string[]
    votes: number 
    adminImages?: string[]
    adminComments?: string[]
}

function GrievanceCard(props: GrievanceCardProps) {

    const [votes, setVotes] = useState(props.votes)
    const [upVoted, setUpVoted] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [discriptionSmall, setDiscriptionSmall] = useState(props.description)

    const handleUpVoteClick = () => {
        // TODO: Send request to the backend API
        if(upVoted){
            setUpVoted(false)
            setVotes(votes - 1)
        }else{
            setUpVoted(true)
            setVotes(votes + 1)
        }
    }

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    if(discriptionSmall.length > 200){
    useEffect(() => {
        if (props.description.length > 350) {
            setDiscriptionSmall(props.description.substring(0, 350) + "...Read More");
        } else {
            setDiscriptionSmall(props.description);
        }
    }, [props.description]);

  return (
    <div className='w-[80%] p-4'>
        <div>
            <div className='flex gap-5'>
                <h1 className=' font-semibold text-lg'>{props.title}</h1>
                <p className='font-light'>{props.status ? '🟢 Resolved' : '🟡 Pending'}</p>
            </div>
            {expanded ? (<p className=' text-md text-black mt-2' onClick={()=> {handleExpandClick()}}>{props.description}</p>) :    (<p className=' text-sm text-gray-400 mt-2' onClick={()=> {handleExpandClick()}}>{discriptionSmall}</p>)}
            <div className='flex gap-2 items-center mt-2'>
            {upVoted ? (<p onClick={() => {handleUpVoteClick()}} className='w-6 h-6 '><img src="./upvoted.svg" alt="upvoted" /></   p>) : (<p onClick={() => {handleUpVoteClick()}} className='w-6 h-6'><img src="./default.svg" alt="default" /></p>)}
            <p className='text-xl'>{votes}</p>
            </div>
        </div>
        
    </div>
  )
}
}
export default GrievanceCard