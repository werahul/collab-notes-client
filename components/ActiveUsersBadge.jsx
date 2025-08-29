import React from 'react'

const ActiveUsersBadge = ({users}) => {
  if (!users || users.length === 0) return null;
  return (
    <div className="active">
      <strong className='active-green'>Active collaborators:</strong> {users.join(', ')}
    </div>
  );
}

export default ActiveUsersBadge