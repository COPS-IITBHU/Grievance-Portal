import React from 'react'

interface BadgeProps {
    tag: string;
}

function Badge({ tag }: BadgeProps) {
  return (
    <div className='bg-[#643861] text-white rounded-full text-center py-1 px-6 ml-3 text-sm'>{tag}</div>
  )
}

export default Badge