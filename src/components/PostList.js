import React from 'react';
import PostItem from './PostItem';
import './PostList.css';

const PostList = ({ posts, onEditPost, onDeletePost, loading }) => {
  if (loading) {
    return <div className="loading-message">Загрузка постов...</div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="no-posts-message">Нет доступных постов</div>;
  }

  return (
    <div className="post-list">
      <h2>Посты ({posts.length})</h2>
      <div className="posts-container">
        {posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onEdit={onEditPost}
            onDelete={onDeletePost}
          />
        ))}
      </div>
    </div>
  );
};

export default PostList;
