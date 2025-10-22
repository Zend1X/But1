import React, { useState } from 'react';
import './PostItem.css';

const PostItem = ({ post, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      setIsDeleting(true);
      await onDelete(post.id);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`post-item ${isDeleting ? 'deleting' : ''}`}>
      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-body">{post.body}</p>
        <div className="post-meta">
          <span className="post-user">ID пользователя: {post.userId}</span>
          <span className="post-id">ID поста: {post.id}</span>
        </div>
      </div>
      
      <div className="post-actions">
        <button 
          className="btn-edit"
          onClick={() => onEdit(post)}
          disabled={isDeleting}
        >
          Редактировать
        </button>
        <button 
          className="btn-delete"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </div>
  );
};

export default PostItem;